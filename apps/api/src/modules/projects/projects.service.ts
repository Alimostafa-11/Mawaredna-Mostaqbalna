import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseCrudService } from '../../common/crud/base-crud.service';
import { Project, ProjectDocument } from './project.schema';

@Injectable()
export class ProjectsService extends BaseCrudService<Project> {
  constructor(@InjectModel(Project.name) model: Model<ProjectDocument>) {
    super(model as unknown as Model<Project>, [
      'name.ar',
      'name.en',
      'location.ar',
      'location.en',
    ]);
  }
}
