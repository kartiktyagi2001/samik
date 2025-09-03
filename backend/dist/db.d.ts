import { PrismaClient } from '@prisma/client';
export declare const prisma: PrismaClient<import("@prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
export declare function connectDatabase(): Promise<boolean>;
export declare function disconnectDatabase(): Promise<void>;
//# sourceMappingURL=db.d.ts.map