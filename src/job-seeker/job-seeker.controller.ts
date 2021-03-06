import {
  Controller,
  Get,
  Inject,
  Query,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import {
  JobSeekerSituationId,
  JobSeekerSituation,
} from 'src/job-seeker/entities/job-seeker-situation.entity';
import { JobSeekerSituationNotFoundErrorFilter } from 'src/job-seeker/filters/job-seeker-situation-not-found.filter';
import { GatewayErrorFilter } from 'src/job-seeker/filters/gateway-error.filter';
import {
  JobSeekerSituationRepository,
  JOB_SEEKER_SITUATION_REPOSITORY_TOKEN,
} from 'src/job-seeker/repositories/job-seeker-situation.repository';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ScopesInterceptor } from 'src/job-seeker/interceptors/scopes';

@ApiTags('Pôle Emploi')
@UseInterceptors(ScopesInterceptor)
@Controller('v2/situations-pole-emploi')
export class JobSeekerController {
  constructor(
    @Inject(JOB_SEEKER_SITUATION_REPOSITORY_TOKEN)
    private readonly jobSeekerSituationRepository: JobSeekerSituationRepository,
  ) {}

  @Get()
  @UseFilters(JobSeekerSituationNotFoundErrorFilter)
  @UseFilters(GatewayErrorFilter)
  @ApiOperation({
    summary: "Recherche de la situation Pôle Emploi d'un individu",
  })
  @ApiOkResponse({
    type: JobSeekerSituation,
    description: "La situation Pôle Emploi d'un individu",
  })
  @ApiResponse({
    status: 404,
    description: 'Individu introuvable',
  })
  @ApiResponse({
    status: 502,
    description: 'Erreur en provenance des services Pôle Emploi',
  })
  @ApiQuery({
    name: 'identifiant',
    description:
      "Identifiant Pôle Emploi de l'individu recherché, aussi appelé PeamU",
    example: 'georges_moustaki_77',
  })
  searchJobSeekerSituation(
    @Query('identifiant') id: JobSeekerSituationId,
  ): Promise<JobSeekerSituation> {
    return this.jobSeekerSituationRepository.findById(id);
  }
}
