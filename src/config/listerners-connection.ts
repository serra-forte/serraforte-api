import { SendOrderConfirmationEmailListener } from '@/events/listerners/send-order-confirmation-email.listener';
import { SendOrderConfirmedEmailListener } from '@/events/listerners/send-order-confirmed-email.listener';
import { SendOrderReprovedEmailListener } from '@/events/listerners/send-order-reproved-email.listener';
import { UpdateOrderConfirmedListener } from '@/events/listerners/update-order-confirmed.listener';
import { UpdateOrderReprovedListener } from '@/events/listerners/update-order-reproved.listener';

export async function connectionListerners() {
    try {
       new SendOrderConfirmationEmailListener();
       new SendOrderReprovedEmailListener();
       new SendOrderConfirmedEmailListener();
       new UpdateOrderConfirmedListener();
       new UpdateOrderReprovedListener();


    } catch (error) {
        console.log("Not connected to Listerners")
    }
}