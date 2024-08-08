import { AppDataSource } from "./data-source";
import ApprovedDirection from "./Entity/ApprovedDirection";
import RxRequestLineItemEntity from "./Entity/RxRequestLineItemEntity";
import crypto from "crypto";

const server = async () => {
  const connection = await AppDataSource.initialize();

  const directionRepository = connection.getRepository(ApprovedDirection);
  const direction = await directionRepository.find();
  const lineItemRepository = connection.getRepository(RxRequestLineItemEntity);
  const lineItems = await lineItemRepository.find();

  const instructionToUpdate = direction.map((directionRecord) => {
    const hashedValue = directionRecord.hashedDirection;

    const matchedInstruction = lineItems.find((lineItemRecord) => {
      const instruction =
        lineItemRecord?.lineItem?.patientMedication?.instructions;

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
    })?.lineItem.patientMedication.instructions;

    const updatedRecord = { ...directionRecord, direction: matchedInstruction };

    return updatedRecord;
  });

  console.log("Records to update: ", instructionToUpdate);

  await directionRepository.save(instructionToUpdate);
};
server();
