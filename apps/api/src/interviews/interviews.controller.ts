import { Controller, Post, Get, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { InterviewsService } from './interviews.service';
import { RealtimeService } from './realtime.service';
import { CreateSessionDto, InterviewSession, RealtimeTokenResponse, ApiResponse } from '@ai-interviewer/shared';

@Controller('interviews')
export class InterviewsController {
  constructor(
    private readonly interviewsService: InterviewsService,
    private readonly realtimeService: RealtimeService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createSession(@Body() dto: CreateSessionDto): ApiResponse<{ session: InterviewSession }> {
    const session = this.interviewsService.createSession(dto);
    return {
      success: true,
      data: { session },
      timestamp: new Date().toISOString(),
    };
  }

  @Get(':id')
  getSession(@Param('id') id: string): ApiResponse<{ session: InterviewSession }> {
    const session = this.interviewsService.getSession(id);
    return {
      success: true,
      data: { session },
      timestamp: new Date().toISOString(),
    };
  }

  @Post(':id/start')
  @HttpCode(HttpStatus.OK)
  startSession(@Param('id') id: string): ApiResponse<{ session: InterviewSession }> {
    const session = this.interviewsService.startSession(id);
    return {
      success: true,
      data: { session },
      timestamp: new Date().toISOString(),
    };
  }

  @Post(':id/end')
  @HttpCode(HttpStatus.OK)
  endSession(@Param('id') id: string): ApiResponse<{ session: InterviewSession }> {
    const session = this.interviewsService.endSession(id);
    return {
      success: true,
      data: { session },
      timestamp: new Date().toISOString(),
    };
  }

  @Post(':id/realtime/token')
  @HttpCode(HttpStatus.OK)
  async getRealtimeToken(@Param('id') id: string): Promise<ApiResponse<RealtimeTokenResponse>> {
    const realtimeData = await this.realtimeService.generateCandidateToken(id);
    return {
      success: true,
      data: realtimeData,
      timestamp: new Date().toISOString(),
    };
  }
}
