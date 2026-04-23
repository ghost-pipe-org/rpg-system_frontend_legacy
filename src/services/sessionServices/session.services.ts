import api from "../api";
import type { CreateSessionRequest, ApproveSessionRequest, RejectSessionRequest } from "./session.types";

export const getAprovedSessions = async () => {
    const response = await api.get('/sessions/approved');
    return response.data;
};

export const getSessions = async () => {
    const response = await api.get('/sessions');
    return response.data;
};

export const createSession = async (session: CreateSessionRequest) => {
    const response = await api.post('/sessions', session);
    return response.data;
};

export const getMyEmittedSessions = async () => {
    const response = await api.get('/my-emmitted-sessions');
    console.log("Emitted Sessions Response:", response);
    return response.data;
};

export const getMyEnrolledSessions = async () => {
    const response = await api.get('/my-enrolled-sessions');
    console.log("Enrolled Sessions Response:", response);
    return response.data;
};

export const approveSession = async (sessionId: string, data: ApproveSessionRequest) => {
    const response = await api.patch(`/sessions/${sessionId}/approve`, data);
    return response.data;
};

export const rejectSession = async (sessionId: string, data: RejectSessionRequest) => {
    const response = await api.patch(`/sessions/${sessionId}/reject`, data);
    return response.data;
};

export const enrollInSession = async (sessionId: string) => {
    const response = await api.post(`/sessions/${sessionId}/subscribe`);
    return response.data;
};

export const cancelEnrollment = async (sessionId: string) => {
    const response = await api.delete(`/sessions/${sessionId}/enrollments/me`);
    return response.data;
};

export const cancelApprovedSession = async (sessionId: string, cancelEvent: string) => {
    const response = await api.delete(`/sessions/${sessionId}/cancel`, { data: { cancelEvent } });
    return response.data;
};

// Workshops (Oficinas)
export const getApprovedWorkshops = async () => {
    const response = await api.get('/workshops/approved');
    return response.data;
};

export const getWorkshops = async () => {
    const response = await api.get('/workshops');
    return response.data;
};

export const createWorkshop = async (workshop: any) => {
    const response = await api.post('/workshops', workshop);
    return response.data;
};

export const enrollInWorkshop = async (workshopId: string) => {
    const response = await api.post(`/workshops/${workshopId}/subscribe`);
    return response.data;
};

export const cancelWorkshopEnrollment = async (workshopId: string) => {
    const response = await api.delete(`/workshops/${workshopId}/enrollments/me`);
    return response.data;
};

export const approveWorkshop = async (workshopId: string, data: any) => {
    const response = await api.patch(`/workshops/${workshopId}/approve`, data);
    return response.data;
};

export const rejectWorkshop = async (workshopId: string, data: any) => {
    const response = await api.patch(`/workshops/${workshopId}/reject`, data);
    return response.data;
};

export const cancelApprovedWorkshop = async (workshopId: string, cancelEvent: string) => {
    const response = await api.delete(`/workshops/${workshopId}/cancel`, { data: { cancelEvent } });
    return response.data;
};

export const getMyFacilitatedWorkshops = async () => {
    const response = await api.get('/my-facilitated-workshops');
    return response.data;
};