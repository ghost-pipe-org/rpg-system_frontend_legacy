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