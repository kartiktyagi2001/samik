import type { Request, Response } from "express";
import { prisma, connectDatabase } from "../db";
import { ApiAggregator } from "../services/ApiAggregator";
import { CsvExporter } from "../utils/csvExporter";
import type { Prisma } from "@prisma/client";

export class AggregateController {
  private apiAggregator = new ApiAggregator();

  //GET /api/aggregate
  async listGroups(req: Request, res: Response): Promise<void> {
    try {
      const groups = await prisma.apiGroup.findMany({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          description: true,
          _count: { select: { apiSources: true } }
        },
        orderBy: { name: "asc" }
      });

      res.json({
        success: true,
        data: groups.map((g) => ({
          name: g.name,
          description: g.description,
          apiCount: g._count.apiSources,
          endpoint: `/api/aggregate/${g.name}`,
          csvEndpoint: `/api/aggregate/${g.name}?format=csv`
        }))
      });
    } catch (err) {
      console.error("❌ listGroups error:", err);
      res.status(500).json({ success: false, error: "Failed to fetch groups" });
    }
  }

  // /api/aggregate/:groupName
  async aggregateGroup(req: Request, res: Response): Promise<void> {
    try {
      const groupName = req.params.groupName;
      const format = String(req.query.format || "json");

      if (!groupName) {
        res.status(400).json({ success: false, error: "Group name is required" });
        return;
      }

      const group = await prisma.apiGroup.findFirst({
        where: {
          name: { equals: groupName, mode: "insensitive" },
          isActive: true
        },
        include: { apiSources: { where: { isActive: true } } }
      });

      if (!group) {
        res.status(404).json({ success: false, error: "Group not found" });
        return;
      }
      if (group.apiSources.length === 0) {
        res.status(400).json({ success: false, error: "No APIs in group" });
        return;
      }

      //finally we call aggregator service to aggregate data from multiple apis
      const result = await this.apiAggregator.aggregateApiGroup(
        group.apiSources,
        groupName
      );

      // Log request
      await prisma.request.create({
        data: {
          method: "GET",
          endpoint: `/api/aggregate/${groupName}`,
          params: { format, query: req.query } as Prisma.InputJsonValue,
          response: {
            success: result.success,
            recordCount: result.data.length
          } as Prisma.InputJsonValue,
          metadata: {
            timestamp: result.metadata.timestamp,
            sources: result.metadata.sources
          } as unknown as Prisma.InputJsonValue,
          groupId: group.id
        }
      });

      if (format === "csv") {
        const csv = CsvExporter.exportToCsv(result.data, groupName);
        res.header("Content-Type", "text/csv");
        res.send(csv);
        return;
      }

      res.json(result);
    } catch (err) {
      console.error("❌ aggregateGroup error:", err);
      res.status(500).json({ success: false, error: "Failed to aggregate group" });
    }
  }

  //POST /api/aggregate/test
  async testApi(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.apiAggregator.testApi(req.body);
      if (result.success) {
        res.json({ success: true, data: result });
      } else {
        res.status(400).json({ success: false, error: result.error });
      }
    } catch (err) {
      console.error("❌ testApi error:", err);
      res.status(500).json({ success: false, error: "Test API failed" });
    }
  }
}
