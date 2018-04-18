export const buildBarriersConfig = (contract, barriers = { count: contract.barriers }) => {
    barriers[contract.expiry_type] = barriers[contract.expiry_type] || {};

    const obj_barrier = {};
    if (contract.barrier) {
        obj_barrier.barrier = contract.barrier;
    } else {
        if (contract.low_barrier) {
            obj_barrier.low_barrier = contract.low_barrier;
        }
        if (contract.high_barrier) {
            obj_barrier.high_barrier = contract.high_barrier;
        }
    }

    barriers[contract.expiry_type] = obj_barrier;

    return barriers;
};
