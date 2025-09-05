import type { Request, Response } from 'express';
import { prisma } from '../db';
import { ApiAggregator } from '../services/ApiAggregator.js';

export class GroupController {
  private apiAggregator = new ApiAggregator();

  //GET-> /api/groups to get all groups
  async getAllGroups(req: Request, res: Response) {
    try {
      const groups = await prisma.apiGroup.findMany({
        include: {
          apiSources: true,
          _count: { select: { apiSources: true, requests: true } }
        },
        orderBy: { createdAt: 'desc' }
      });
      res.json({ success: true, data: groups });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  //POST-> /api/groups to create a new group
  async createGroup(req: Request, res: Response) {
    try {
      const { name, description } = req.body;
      if (!name) return res.status(400).json({ success: false, error: 'Name required' });
      const existing = await prisma.apiGroup.findFirst({ where: { name: { equals: name, mode: 'insensitive' } } });
      if (existing) return res.status(409).json({ success: false, error: 'Group exists' });
      const group = await prisma.apiGroup.create({ data: { name, description } });
      res.status(201).json({ success: true, data: group });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  // GET-> /api/groups/:id to get group by its id
  async getGroupById(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const group = await prisma.apiGroup.findUnique({
        where: { id },
        include: {
          apiSources: true,
          requests: { take: 5, orderBy: { createdAt: 'desc' } },
          _count: { select: { apiSources: true, requests: true } }
        }
      });
      if (!group) return res.status(404).json({ success: false, error: 'Not found' });
      res.json({ success: true, data: group });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  //POST-> /api/groups/:id/apis to add a new API to a group
  async addApiToGroup(req: Request, res: Response) {
    try {
      const groupId = String(req.params.id);
      const { name, url, method = 'GET', headers, queryParams, timeout = 30000 } = req.body;  //api endpoint details
      if (!name || !url) return res.status(400).json({ success: false, error: 'Name & URL required' });

      //multiplem apis in one request
      // const apis = Array.isArray(req.body) ? req.body : [];
      // if (apis.length === 0) {
      //   return res.status(400).json({ success: false, error: 'Request body must be a non-empty array of APIs' });
      // }

      
      const group = await prisma.apiGroup.findUnique({ where: { id: groupId } });
      if (!group) return res.status(404).json({ success: false, error: 'Group not found' });

      //test the API
      const testResult = await this.apiAggregator.testApi({ name, url, method, headers, queryParams, timeout });
      if (!testResult.success) {
        return res.status(400).json({ success: false, error: 'Test failed', details: testResult.error });
      }

      const apiSource = await prisma.apiSource.create({
        data: { name, url, method, headers, queryParams, timeout, groupId }
      });
      res.status(201).json({ success: true, data: apiSource });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /** DELETE /api/groups/:groupId/apis/:apiId */
  async removeApiFromGroup(req: Request, res: Response) {
    try {
      const groupId = String(req.params.groupId);
      const apiId = String(req.params.apiId);
      await prisma.apiSource.delete({ where: { id: apiId } });
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /** DELETE /api/groups/:id */
  async deleteGroup(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      await prisma.apiGroup.delete({ where: { id } });
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}
