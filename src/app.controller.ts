import {
  BadRequestException,
  NotFoundException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CreatePropertyDto } from './dtos/createPropertyDTO/createProperty.dto';
import { ApiTags } from '@nestjs/swagger';
import { IdOPropertyDto } from './dtos/GetProperty/getPropertyByIdDto.dto';
import { validate } from 'class-validator';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdatePropertyBasicDataDTO } from './dtos/updatePropertyDTO/updatePropertyBasicData.dto';
import { CreatePropertyFeaturesDTO } from './dtos/createPropertyFeaturesDTO/createPropertyFeature.dto';

@ApiTags('properties')
@Controller('properties')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async postProperty(
    @Body() body: any,
    @UploadedFile() image: Express.Multer.File,
  ) {
    // Map the request body to CreatePropertyDto
    const propertyDto: CreatePropertyDto = {
      ...body,
      image: image,
    };

    return await this.appService.createNewProperty(propertyDto);
  }

  @Get()
  async getProperties() {
    return await this.appService.getProperties();
  }

  @Get(':propertyId')
  async getPropertyById(@Param('propertyId') propertyId: string) {
    // Crear una instancia del DTO y asignar el valor
    const dto = new IdOPropertyDto();
    dto.propertyId = propertyId;

    // Validar el DTO
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }

    const property = await this.appService.getPropertyById(propertyId);
    if (!property) {
      throw new NotFoundException(`Property with ID ${propertyId} not found`);
    }
    return { property };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteProperty(@Param('id') id: string) {
    return await this.appService.deleteProperty(id);
  }

  @Patch('id')
  async updateBasicData(
    @Param('id') id: string,
    @Body() updateBasicData: UpdatePropertyBasicDataDTO,
  ) {
    return await this.appService.updateBasicData(id, updateBasicData);
  }

  @Post('features')
  async createNewFeature(
    @Body() createPropertyFeaturesDTO: CreatePropertyFeaturesDTO,
  ) {
    return await this.appService.createNewPropertyFeature(
      createPropertyFeaturesDTO,
    );
  }

  @Delete(':propertyId/features/:featureId')
  @HttpCode(HttpStatus.OK)
  async deletePropertyFeature(
    @Param('propertyId') propertyId: string,
    @Param('featureId') featureId: string,
  ) {
    return await this.appService.deletePropertyFeature(featureId, propertyId);
  }

  @Post(':propertyId/medias')
  @UseInterceptors(FileInterceptor('image'))
  async createNewPropertyMedia(
    @UploadedFile() image: Express.Multer.File,
    @Param('id') propertyId: string,
  ) {
    return await this.appService.createNewPropertyMedia(image, propertyId);
  }

  @Delete(':propertyId/medias/:mediaId')
  @HttpCode(HttpStatus.OK)
  async deletePropertyMedia(
    @Param('propertyId') propertyId: string,
    @Param('mediaId') mediaId: string,
  ) {
    return await this.appService.deletePropertyMedia(mediaId, propertyId);
  }
}
