import { IOrderRelationsDTO } from '@/dtos/order-relations.dto';
import { eventBus } from './event-bus';
import { EventBusBase } from './event-bus.base';
import { ISendOrderConfirmationEmail } from './interfaces/send-order-confirmation.interface';
import { IUpdateUserNaturalErp } from './interfaces/update-user-erp.interface';

export class EventBus implements EventBusBase {
    updateUserForErpEvent(data: IUpdateUserNaturalErp): void {
        try {
            eventBus.emit('update.user.erp', data);
        } catch (error) {
            throw error
        }
    }
    sendOrderReprovedEmailEvent(data: IOrderRelationsDTO): void {
        try {
            eventBus.emit('send.order.reproved', data);
        } catch (error) {
            throw error
        }
    }
    sendOrderConfirmationEmailEvent(data: ISendOrderConfirmationEmail): void {
        try {
            eventBus.emit('send.order.confirmation', data);
        } catch (error) {
            throw error
        }
    }
    sendOrderApprovedEmailEvent(data: IOrderRelationsDTO): void {
        try {
            eventBus.emit('send.order.approved', data);
        } catch (error) {
            throw error
        }
    }
    updateOrderReprovedEvent(data: IOrderRelationsDTO): void {
        try {
            eventBus.emit('update.order.reproved', data);
        } catch (error) {
            throw error
        }
    }
    updateOrderConfirmedEvent(data: IOrderRelationsDTO): void {
        try {
            eventBus.emit('update.order.confirmed', data);
        } catch (error) {
            throw error
        }
    }
}