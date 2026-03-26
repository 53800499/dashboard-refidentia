"use client";

import { useState } from "react";
import {
  getResource,
  postResource,
  updateResourceById,
  deleteResource,
  getResourceById,
} from "@/services/api";

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApiService<T>() {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const handleRequest = async (request: Promise<any>) => {
    try {
      setState({ data: null, loading: true, error: null });
      const response = await request;
      setState({ data: response.data, loading: false, error: null });
      return response.data;
    } catch (err: any) {
      setState({
        data: null,
        loading: false,
        error: err.response?.data?.message || "Une erreur est survenue",
      });
      throw err;
    }
  };

  const fetchAll = (resource_url: string) =>
    handleRequest(getResource({ resource_url }));

  const fetchById = (resource_url: string, id: number | string) =>
    handleRequest(getResourceById({ resource_url, resource_id: id }));

  const create = (resource_url: string, data: object) =>
    handleRequest(postResource({ resource_url, resource_data: data }));

  const update = (resource_url: string, id: number | string, data: object) =>
    handleRequest(
      updateResourceById({
        resource_url,
        resource_id: id,
        resource_data: data,
      })
    );

  const remove = (resource_url: string, id: number | string) =>
    handleRequest(deleteResource({ resource_url: `${resource_url}/${id}` }));

  return {
    ...state,
    fetchAll,
    fetchById,
    create,
    update,
    remove,
  };
}