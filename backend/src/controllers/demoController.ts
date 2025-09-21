// import type { Request, Response } from 'express';
// import { prisma } from '../db';
// import { ApiAggregator } from '../services/ApiAggregator.js';
// import type { Prisma } from "@prisma/client";


// //Group Controller

// export class DemoGroupCtrl{
//     private apiAggregator = new ApiAggregator();


//     //get all demo groups
//     async getAllGroups(req: Request, res: Response) {
//     try {


//       const groups = await prisma.demoGroup.findMany({
//         include: {
//           apiSources: true,
//           _count: { select: { apiSources: true, requests: true } }
//         },
//         orderBy: { createdAt: 'desc' }
//       });
//       res.json({ success: true, data: groups });
//     } catch (err: any) {
//       res.status(500).json({ success: false, error: err.message });
//     }
//   }


//   //new demo group
//   async createGroup(req: Request, res: Response) {
//     try {


//       const { name, description } = req.body;
//       if (!name) return res.status(400).json({ success: false, error: 'Name required' });
//       const existing = await prisma.demoGroup.findFirst({
//           where: {
//               name: { equals: name, mode: 'insensitive' } 
//             } 
//         });
//       if (existing) return res.status(409).json({ success: false, error: 'Group exists! Choose a different name' });
//       const group = await prisma.demoGroup.create({ data: { name, description } });
//       res.status(201).json({ success: true, data: group });
//     } catch (err: any) {
//       res.status(500).json({ success: false, error: err.message });
//     }
//   }


//   //access single group
//   async getGroupById(req: Request, res: Response) {
//     try {
//       const id = String(req.params.id);
//       const group = await prisma.demoGroup.findUnique({
//         where: { id },
//         include: {
//           apiSources: true,
//           requests: { take: 5, orderBy: { createdAt: 'desc' } },
//           _count: { select: { apiSources: true, requests: true } }
//         }
//       });
//       if (!group) return res.status(404).json({ success: false, error: 'Not found' });
//       res.json({ success: true, data: group });
//     } catch (err: any) {
//       res.status(500).json({ success: false, error: err.message });
//     }
//   }


//   //add apis
//   async addApiToGroup(req: Request, res: Response) {
//     try {
//       const groupId = String(req.params.id);


//       const { name, url, method = 'GET', headers, queryParams, timeout = 30000 } = req.body


//       if (!name || !url) return res.status(400).json({ success: false, error: 'Name & URL required' });
      
//       const group = await prisma.demoGroup.findUnique({ where: { id: groupId } });
//       if (!group) return res.status(404).json({ success: false, error: 'Group not found' });


//       //test the API
//       const testResult = await this.apiAggregator.testApi({ name, url, method, headers, queryParams, timeout });
//       if (!testResult.success) {
//         return res.status(400).json({ success: false, error: 'Test failed', details: testResult.error });
//       }


//       const apiSource = await prisma.demoApiSource.create({
//         data: { name, url, method, headers, queryParams, timeout, groupId }
//       });
//       res.status(201).json({ success: true, data: apiSource });
//     } catch (err: any) {
//       res.status(500).json({ success: false, error: err.message });
//     }
//   }


//   //remove apis
//   async removeApiFromGroup(req: Request, res: Response) {
//     try {
//       const groupId = String(req.params.groupId);
//       const apiId = String(req.params.apiId);
//       await prisma.demoApiSource.delete({ where: { id: apiId } });
//       res.json({ success: true });
//     } catch (err: any) {
//       res.status(500).json({ success: false, error: err.message });
//     }
//   }


//   //delete demo group
//   async deleteGroup(req: Request, res: Response) {
//     try {
//       const id = String(req.params.id);
//       await prisma.demoGroup.delete({ where: { id } });
//       res.json({ success: true });
//     } catch (err: any) {
//       res.status(500).json({ success: false, error: err.message });
//     }
//   }
// }


// //Aggregate Controller

// export class DemoAggrCtrl {
//   private apiAggregator = new ApiAggregator();


//   //run or aggregate group
//   async aggregateGroup(req: Request, res: Response): Promise<void> {
//     try {
//       const groupName = req.params.groupName;
//       const format = String(req.query.format || "json");

//       //test log
//       console.log(groupName)


//       if (!groupName) {
//         res.status(400).json({ success: false, error: "Group name is required" });
//         return;
//       }


//       const group = await prisma.demoGroup.findFirst({
//         where: {
//           name: { equals: groupName, mode: "insensitive" },
//           isActive: true
//         },
//         include:{apiSources: {where: {isActive: true}}}
//       });


//       if (!group) {
//         res.status(404).json({ success: false, error: "Group not found" });
//         return;
//       }
//       if (group.apiSources.length === 0) {
//         res.status(400).json({ success: false, error: "No APIs in group" });
//         return;
//       }


//       //finally we call aggregator service to aggregate data from multiple apis
//       const result = await this.apiAggregator.aggregateApiGroup(
//         group.apiSources,
//         groupName
//       );


//       //log request
//       await prisma.demoRequest.create({
//         data: {
//           method: "GET",
//           endpoint: `/api/aggregate/${groupName}`,
//           params: { format, query: req.query } as Prisma.InputJsonValue,
//           response: {
//             success: result.success,
//             recordCount: result.data.length
//           } as Prisma.InputJsonValue,
//           metadata: {
//             timestamp: result.metadata.timestamp,
//             sources: result.metadata.sources
//           } as unknown as Prisma.InputJsonValue,
//           groupId: group.id
//         }
//       });


//       res.json(result);
//     } catch (err) {
//       console.error("❌ oh shit! error:", err);
//       res.status(500).json({ success: false, error: "Failed to aggregate group" });
//     }
//   }


//   //test endpoint
//   async testApi(req: Request, res: Response): Promise<void> {
//     try {
//       const result = await this.apiAggregator.testApi(req.body);
//       if (result.success) {
//         res.json({ success: true, data: result });
//       } else {
//         res.status(400).json({ success: false, error: result.error });
//       }
//     } catch (err) {
//       console.error("❌ testApi error:", err);
//       res.status(500).json({ success: false, error: "Test API failed" });
//     }
//   }
// }


import type { Request, Response } from 'express';
import { prisma } from '../db';
import { ApiAggregator } from '../services/ApiAggregator.js';
import type { Prisma } from "@prisma/client";


//Group Controller


export class DemoGroupCtrl{
    private apiAggregator = new ApiAggregator();


    //get all demo groups
    async getAllGroups(req: Request, res: Response) {
    try {


      const groups = await prisma.demoGroup.findMany({
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


  //new demo group
  async createGroup(req: Request, res: Response) {
    try {


      const { name, description } = req.body;
      if (!name) return res.status(400).json({ success: false, error: 'Name required' });
      const existing = await prisma.demoGroup.findFirst({
          where: {
              name: { equals: name, mode: 'insensitive' } 
            } 
        });
      if (existing) return res.status(409).json({ success: false, error: 'Group exists! Choose a different name' });
      const group = await prisma.demoGroup.create({ data: { name, description } });
      res.status(201).json({ success: true, data: group });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }


  //access single group
  async getGroupById(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const group = await prisma.demoGroup.findUnique({
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


  //add apis
  async addApiToGroup(req: Request, res: Response) {
    try {
      const groupId = String(req.params.id);


      const { name, url, method = 'GET', headers, queryParams, timeout = 30000 } = req.body


      if (!name || !url) return res.status(400).json({ success: false, error: 'Name & URL required' });
      
      const group = await prisma.demoGroup.findUnique({ where: { id: groupId } });
      if (!group) return res.status(404).json({ success: false, error: 'Group not found' });


      //test the API
      const testResult = await this.apiAggregator.testApi({ name, url, method, headers, queryParams, timeout });
      if (!testResult.success) {
        return res.status(400).json({ success: false, error: 'Test failed', details: testResult.error });
      }


      const apiSource = await prisma.demoApiSource.create({
        data: { name, url, method, headers, queryParams, timeout, groupId }
      });
      res.status(201).json({ success: true, data: apiSource });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }


  //remove apis
  async removeApiFromGroup(req: Request, res: Response) {
    try {
      const groupId = String(req.params.groupId);
      const apiId = String(req.params.apiId);
      await prisma.demoApiSource.delete({ where: { id: apiId } });
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }


  //delete demo group
  async deleteGroup(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      await prisma.demoGroup.delete({ where: { id } });
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}


//Aggregate Controller


export class DemoAggrCtrl {
  private apiAggregator = new ApiAggregator();


  //run or aggregate group
  async aggregateGroup(req: Request, res: Response): Promise<void> {
    try {
      const groupName = req.params.groupName;
      //testlog
      console.log(groupName);
      
      const format = String(req.query.format || "json");


      if (!groupName) {
        res.status(400).json({ success: false, error: "Group name is required" });
        return;
      }


      const group = await prisma.demoGroup.findFirst({
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
      await prisma.demoRequest.create({
        data: {
          method: "GET",
          endpoint: `/demo/aggregate/${groupName}`,
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


      res.json(result);
    } catch (err) {
      console.error("❌ oh shit! error:", err);
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

