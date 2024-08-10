import { AppDataSource } from "./data-source";
import ApprovedDirection from "./Entity/ApprovedDirection";
import RxRequestLineItemEntity from "./Entity/RxRequestLineItemEntity";
import crypto from "crypto";
import RxRequestEntity from "./Entity/RxRequestEntity";

const server = async () => {
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

  const instructions = queryResponse.map((response) => {
    return response.instructions;
  });

  const directionRepository = connection.getRepository(ApprovedDirection);
  const directionRecords = await directionRepository.find();

  const instructionToUpdate = directionRecords.map((directionRecord) => {
    const hashedValue = directionRecord.hashedDirection;

    const matchedInstruction = instructions.find((instruction) => {
      if (!!instruction) {
        const transformedDirection = instruction
          .replace(/\s+/g, "")
          .toLowerCase();

        const hashedDirection = crypto
          .createHash("sha256")
          .update(transformedDirection)
          .digest("hex");

        if (hashedDirection == hashedValue) {
          return instruction;
        }
      }
    });

    const updatedRecord = { ...directionRecord, direction: matchedInstruction };

    return updatedRecord;
  });

  await directionRepository.save(instructionToUpdate);
};
server();
