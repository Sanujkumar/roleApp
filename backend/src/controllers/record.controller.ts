import { Request, Response } from 'express';
import { RecordService } from '../services/record.service';

const recordService = new RecordService();

export class RecordController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const records = await recordService.getRecords(req.user);
      res.json({ success: true, data: records });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch records';
      res.status(500).json({ success: false, error: message });
    }
  }
}
