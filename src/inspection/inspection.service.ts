import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Inspection, InspectionDocument } from './schemas/inspection.entity';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { UpdateInspectionDto } from './dto/update-inspection.dto';
import { Model } from 'mongoose';
import { IRealState } from './interface/real-state.interface';

@Injectable()
export class InspectionService {
  constructor(
    @InjectModel(Inspection.name)
    private inspectionModel: Model<InspectionDocument>,
  ) {}

  create(createInspectionDto: CreateInspectionDto) {
    const { address, name } = createInspectionDto;

    const realState: IRealState = {
      inspection_rooms: [
        {
          active: false,
          name: 'cozinha',
          inspection_points: [
            {
              description: 'lampada',
              options: ['funcionando', 'quebrada', 'sem lampada'],
            },
          ],
        },
      ],
    };
  }

  findAll() {
    return `This action returns all inspection`;
  }

  findOne(id: number) {
    return `This action returns a #${id} inspection`;
  }

  update(id: number, updateInspectionDto: UpdateInspectionDto) {
    return `This action updates a #${id} inspection`;
  }

  remove(id: number) {
    return `This action removes a #${id} inspection`;
  }
}
