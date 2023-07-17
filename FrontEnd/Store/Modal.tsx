import { createSlice } from "@reduxjs/toolkit"

type initialState = {
    message: string,
    modalOpen: boolean,
    image: '',
    modal: boolean,
    requestModal: boolean,
    addAdminModal: boolean,
    addRatingModal: boolean,
    deleteModal: boolean,
    isUpdating: boolean,
    productId: string,
    type: boolean,
    termModal: boolean,
    sellerPayoutModal: boolean
}
const initialState : initialState = {
    modalOpen: false,
    message: '',
    image: '',
    addAdminModal: false,
    modal: false,
    requestModal: false,
    deleteModal: false,
    addRatingModal: false,
    productId: '',
    type: false,
    isUpdating: false,
    termModal: false,
    sellerPayoutModal: false
}
interface IMutate {
    id: string
}
const modal = createSlice({
    initialState,
    name: 'modal',
    reducers: {
        modalUserOpen(state: initialState, action: any){
            state.modalOpen = true;
            state.message = action.payload.message
            state.image = action.payload.image
        },
        editModal(state: initialState){
            state.modal = true;
        },
        requestModalOpen(state: initialState){
            state.requestModal = true
        },

        requestModalClose(state: initialState){
            state.requestModal = false
        },
        deleteModalOpen(state: initialState, action){
            state.deleteModal = true;
            state.productId = action.payload.id
            state.type = action.payload.type
        },
        deleteModalClose(state: initialState){
            state.deleteModal = false
        },
        addAdminModalOpen(state: initialState, action){
            state.addAdminModal = true
            state.productId = action.payload.id
        },
        addAdminModalClose(state: initialState){
            state.addAdminModal = false
        },
        addRatingModalOpen(state: initialState){
            state.addRatingModal = true
        },
        updateModal (state: initialState) {
            state.isUpdating = !state.isUpdating
        },
        addRatingModalClose(state: initialState){
            state.addRatingModal = false
        },
        modalClose(state:  initialState){
            state.modalOpen = false;
        },
        addProductId(state : initialState, action: any) {
          state.productId = action.payload.id
        },
        handleCloseModal(state:  initialState){
            state.modal = false;
        },
        openTermModal(state: initialState) {
            state.termModal = true
        },
        closeTermModal(state: initialState) {
            state.termModal = false
        },
        openSellerPayoutModal(state: initialState) {
            state.sellerPayoutModal = true
        },
        closeSellerPayoutModal(state: initialState) {
            state.sellerPayoutModal = false
        }
    }
})
export const { closeSellerPayoutModal, openSellerPayoutModal, modalUserOpen, updateModal, addProductId, modalClose, editModal, deleteModalOpen, deleteModalClose, addRatingModalOpen, addRatingModalClose, handleCloseModal, addAdminModalOpen,addAdminModalClose, requestModalOpen, requestModalClose , openTermModal, closeTermModal} = modal.actions;
export default modal.reducer;
