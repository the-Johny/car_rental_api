// import { AuthGuard } from '@nestjs/passport';
// import { PaymentService } from './payment.service';
// import { MakePaymentDto } from './dto/make-payment.dto';
// import { Controller, Get, Post, UseGuards } from '@nestjs/common';

// @Controller('payments')
// @UseGuards(AuthGuard)
// export class PaymentsController {
//   constructor(private readonly paymentsService: PaymentService) {}

//   @Post()
//   makePayment(@Request() req, @Body() dto: MakePaymentDto) {
//     return this.paymentsService.makePayment(req.user.id, dto);
//   }

//   @Get('me')
//   getMyPayments(@Request() req) {
//     return this.paymentsService.getUserPayments(req.user.id);
//   }

//   @Get('receipt/:bookingId')
//   getReceipt(@Request() req, @Param('bookingId') bookingId: string) {
//     return this.paymentsService.getBookingReceipt(req.user.id, bookingId);
//   }
// }
