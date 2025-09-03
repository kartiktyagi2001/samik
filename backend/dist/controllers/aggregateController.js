import { PrismaClient } from "@prisma/client/wasm";
import { prisma } from "../db.js";
import { ApiAggregator } from "../services/ApiAggregator.js";
export class AggregateController {
    apiAggregator = new ApiAggregator();
}
//# sourceMappingURL=aggregateController.js.map