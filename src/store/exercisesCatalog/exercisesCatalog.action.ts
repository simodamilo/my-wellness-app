import { createAction } from "@reduxjs/toolkit";

const manageCreateModal = createAction<boolean>("data/manageCreateModal");

const exercisesCatalogActions = {
    manageCreateModal,
};

export { exercisesCatalogActions };
