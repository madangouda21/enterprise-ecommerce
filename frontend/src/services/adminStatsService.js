import adminProductService from "./adminProductService";
import userService from "./userService";
import orderService from "./orderService";
import inventoryService from "./inventoryService";
import paymentService from "./paymentService";
import shippingService from "./shippingService";

const adminStatsService = {
    async load() {
        const results = await Promise.allSettled([
            adminProductService.getAllProducts(),
            userService.getAllUsers(),
            orderService.getOrders(),
            inventoryService.getInventory(),
            paymentService.getPayments(),
            shippingService.getShipping()
        ]);

        const value = (index) => results[index].status === "fulfilled"
            ? results[index].value
            : [];

        return {
            products: value(0),
            users: value(1),
            orders: value(2),
            inventory: value(3),
            payments: value(4),
            shipping: value(5),
            errors: results.filter(item => item.status === "rejected").length
        };
    }
};

export default adminStatsService;
