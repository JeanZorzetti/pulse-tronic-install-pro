import axios from '@/lib/axios';
import type { Contact, ContactStatus, ApiResponse, PaginatedResponse } from '@/types';

interface GetContactsParams {
  page?: number;
  take?: number;
  search?: string;
  status?: ContactStatus;
}

interface UpdateContactStatusPayload {
  status: ContactStatus;
}

class ContactService {
  private baseUrl = '/api/admin/contacts';

  async getAll(params: GetContactsParams = {}): Promise<PaginatedResponse<Contact>> {
    const { page = 1, take = 10, search, status } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      take: take.toString(),
    });

    if (search) queryParams.append('search', search);
    if (status) queryParams.append('status', status);

    const response = await axios.get<ApiResponse<PaginatedResponse<Contact>>>(
      `${this.baseUrl}?${queryParams.toString()}`
    );
    return response.data.data;
  }

  async getById(id: string): Promise<Contact> {
    const response = await axios.get<ApiResponse<Contact>>(`${this.baseUrl}/${id}`);
    return response.data.data;
  }

  async updateStatus(id: string, payload: UpdateContactStatusPayload): Promise<Contact> {
    const response = await axios.patch<ApiResponse<Contact>>(
      `${this.baseUrl}/${id}/status`,
      payload
    );
    return response.data.data;
  }

  async delete(id: string): Promise<void> {
    await axios.delete(`${this.baseUrl}/${id}`);
  }
}

export const contactService = new ContactService();
