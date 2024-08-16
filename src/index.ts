import { AppDataSource } from "./data-source";
import ApprovedDirection from "./Entity/ApprovedDirection";
import crypto from "crypto";
import dotenv from "dotenv";
import { compact } from "lodash";
import ApprovedSigs from "./Entity/ApprovedSigs";
import RxOrderEntity from "./Entity/RxOrderEntity";
import RxRequestEntity from "./Entity/RxRequestEntity";
import RxRequestLineItemEntity from "./Entity/RxRequestLineItemEntity";
import PrescriptionEntity from "./Entity/PrescriptionEntity";
import PrescriptionOverrideEntity from "./Entity/PrescriptionOverrideEntity";

dotenv.config({ path: `.env.${process.env.NODE_ENV || "test"}` });

const filter = async () => {
  try {
    const connection = await AppDataSource.initialize();
    const queryResponse = await connection
      .getRepository(RxRequestEntity)
      .createQueryBuilder("rx_request")
      .select(
        "rx_request_line_item.line_item->'patientMedication'->>'instructions' as instructions"
      )
      .innerJoin(
        RxRequestLineItemEntity,
        "rx_request_line_item",
        "rx_request_line_item.rx_request_id=rx_request.rx_request_id"
      )
      .where("rx_request.meta_data->> 'requestType' =:requestType", {
        requestType: "RX_ENTRY",
      })
      .getRawMany();
    const getHashedValue = (text: string): string => {
      const transformedDirection = text.replace(/\s+/g, "").toLowerCase();
      const hashedDirection = crypto
        .createHash("sha256")
        .update(transformedDirection)
        .digest("hex");
      return hashedDirection;
    };
    const instructions = queryResponse.map((response) => {
      return response.instructions;
    });
    const directionRepository = connection.getRepository(ApprovedDirection);
    const approvedSigsRepo = connection.getRepository(ApprovedSigs);
    const directionRecords = await directionRepository.find();
    const approvedSigs = await approvedSigsRepo.find();
    const instructionToUpdate = directionRecords.map(
      (directionRecord, index) => {
        console.log("Record: ", index);
        const hashedValue = directionRecord.hashedDirection;
        const matchedInstruction = instructions.find(
          (instruction) =>
            !!instruction && hashedValue === getHashedValue(instruction)
        );
        const instructionToSave =
          matchedInstruction ||
          approvedSigs.find(({ sig }) => hashedValue === getHashedValue(sig))
            ?.sig;
        const updatedRecord = {
          ...directionRecord,
          direction: directionRecord?.direction || instructionToSave,
        };
        return updatedRecord;
      }
    );
    console.log("instructionToUpdate: ", instructionToUpdate.length);
    console.log("instructionToUpdate: ", instructionToUpdate);
    await directionRepository.save(compact(instructionToUpdate));
  } catch (error) {
    console.log("Error : ", JSON.stringify(error));
    throw error;
  }
};

const server = async () => {
  try {
    const connection = await AppDataSource.initialize();

    const orderQueryResponse = await connection
      .getRepository(RxOrderEntity)
      .createQueryBuilder("rx_order")
      .select("rx_order")
      .innerJoinAndSelect(
        RxRequestEntity,
        "rx_request",
        "rx_request.rx_request_id =rx_order.rx_request_id and rx_request.meta_data->>'requestType' =:requestType",
        {
          requestType: "RX_ENTRY",
        }
      )
      .innerJoinAndSelect(
        RxRequestLineItemEntity,
        "rx_request_line_item",
        "rx_request_line_item.rx_order_id=rx_order.order_id"
      )
      .innerJoinAndSelect(
        PrescriptionEntity,
        "prescription",
        "prescription.pom_prescription_id=rx_request_line_item.pom_prescription_id"
      )
      .innerJoinAndSelect(
        PrescriptionOverrideEntity,
        "prescription_override",
        "prescription_override.prescription_uuid =prescription.pom_prescription_id"
      )
      .where("rx_order.status IN (:...status)", {
        status: [
          "OPEN",
          "HOLD",
          "ORDER_VERIFICATION",
          "READY_FOR_SHIPMENT",
          "ORDER_VERIFIED",
          "ADDED_TO_SHIPMENT",
        ],
      })
      .andWhere("rx_order.processed_external =:value", { value: "false" })
      .getRawMany();

    const Response = orderQueryResponse.map((response) => {
      const partnerId = response.rx_request_meta_data.requestMetaData.partnerId;
      const referenceId =
        response.rx_request_meta_data.requestMetaData.referenceId;

      const searchKey = `Prescription.${partnerId}.${referenceId}`;
      //  console.log("<<<< Prescription >>>>", searchKey);

      const drugName = response.prescription_prescriptiondata.drug;
      const strength = response.prescription_prescriptiondata.strength;
      const quantity = response.prescription_prescriptiondata.drugUnit;

      let overRideDrugName = response.prescription_override_drug_name;
      if (!!overRideDrugName) {
        return (overRideDrugName = drugName);
      }
      let overRideStrength = response.prescription_override_strength;
      if (!!overRideStrength) {
        return (overRideStrength = drugName);
      }
      let overRideQuantity = response.prescription_override_unit;
      if (!!overRideQuantity) {
        return (overRideQuantity = quantity);
      }
    });
  } catch (error) {
    console.log("Error : ", JSON.stringify(error));
    throw error;
  }
};
server();
