import { AppDataSource } from "./data-source";
import ApprovedDirection from "./Entity/ApprovedDirection";
import RxRequestLineItemEntity from "./Entity/RxRequestLineItemEntity";
import crypto from "crypto";
import RxRequestEntity from "./Entity/RxRequestEntity";
import dotenv from "dotenv";
import { compact } from "lodash";
import ApprovedSigs from "./Entity/ApprovedSigs";

dotenv.config({ path: `.env.${process.env.NODE_ENV || "test"}` });

const server = async () => {
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

server();
