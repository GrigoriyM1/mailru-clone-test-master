import { DataProvider } from 'react-admin';
import { axiosWithAuth } from './interceptors';
import { stringify } from 'query-string';
import { AxiosHeaders } from 'axios';

export const customDataProvider = (
	apiUrl: string,
	countHeader: string = 'Content-Range'
): DataProvider => ({
	getList: (resource, params) => {
		const { page, perPage } = params.pagination || { page: 1, perPage: 10 };
		const { field, order } = params.sort || { field: 'id', order: 'ASC' };
		const rangeStart = (page - 1) * perPage;
		const rangeEnd = page * perPage - 1;
		const query = {
			sort: JSON.stringify([field, order]),
			range: JSON.stringify([rangeStart, rangeEnd]),
			filter: JSON.stringify(params.filter),
		};
		const url = `${apiUrl}/${resource}?${stringify(query)}`;
		const options =
			countHeader === 'Content-Range'
				? {
						headers: { Range: `${resource}=${rangeStart}-${rangeEnd}` },
						signal: params?.signal,
				  }
				: { signal: params?.signal };

		return axiosWithAuth.get(url, options).then(({ headers, data }) => {
			if (!(headers instanceof AxiosHeaders) || !headers.has(countHeader)) {
				throw new Error(
					`The ${countHeader} header is missing in the HTTP Response.`
				);
			}
			return {
				data,
				total:
					countHeader === 'Content-Range'
						? parseInt(
								String((headers as AxiosHeaders).get('content-range'))
									?.split('/')
									.pop() || '',
								10
						  )
						: parseInt(
								String(
									(headers as AxiosHeaders).get(countHeader.toLowerCase())
								) || '0'
						  ),
			};
		});
	},
	getOne: (resource, params) =>
		axiosWithAuth
			.get(`${apiUrl}/${resource}/get-by-id/${encodeURIComponent(params.id)}`, {
				signal: params?.signal,
			})
			.then(({ data }) => ({ data })),
	getMany: (resource, params) => {
		const query = { filter: JSON.stringify({ id: params.ids }) };
		const url = `${apiUrl}/${resource}?${stringify(query)}`;
		return axiosWithAuth
			.get(url, { signal: params?.signal })
			.then(({ data }) => ({ data }));
	},
	getManyReference: (resource, params) => {
		const { page, perPage } = params.pagination;
		const { field, order } = params.sort;
		const rangeStart = (page - 1) * perPage;
		const rangeEnd = page * perPage - 1;
		const query = {
			sort: JSON.stringify([field, order]),
			range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
			filter: JSON.stringify({ ...params.filter, [params.target]: params.id }),
		};
		const url = `${apiUrl}/${resource}?${stringify(query)}`;
		const options =
			countHeader === 'Content-Range'
				? {
						headers: { Range: `${resource}=${rangeStart}-${rangeEnd}` },
						signal: params?.signal,
				  }
				: { signal: params?.signal };

		return axiosWithAuth.get(url, options).then(({ headers, data }) => {
			if (!(headers instanceof AxiosHeaders) || !headers.has(countHeader)) {
				throw new Error(
					`The ${countHeader} header is missing in the HTTP Response.`
				);
			}
			return {
				data,
				total:
					countHeader === 'Content-Range'
						? parseInt(
								String((headers as AxiosHeaders).get('content-range'))
									?.split('/')
									.pop() || '',
								10
						  )
						: parseInt(
								String(
									(headers as AxiosHeaders).get(countHeader.toLowerCase())
								) || '0'
						  ),
			};
		});
	},
	update: (resource, params) =>
		axiosWithAuth
			.put(
				`${apiUrl}/${resource}/${encodeURIComponent(params.id)}`,
				params.data
			)
			.then(({ data }) => ({ data })),
	updateMany: (resource, params) =>
		Promise.all(
			params.ids.map(id =>
				axiosWithAuth.put(
					`${apiUrl}/${resource}/${encodeURIComponent(id)}`,
					params.data
				)
			)
		).then(responses => ({ data: responses.map(({ data }) => data.id) })),
	create: (resource, params) =>
		axiosWithAuth
			.post(`${apiUrl}/${resource}`, params.data)
			.then(({ data }) => ({ data })),
	delete: (resource, params) =>
		axiosWithAuth
			.delete(`${apiUrl}/${resource}/${encodeURIComponent(params.id)}`, {
				headers: { 'Content-Type': 'text/plain' },
			})
			.then(({ data }) => ({ data })),
	deleteMany: (resource, params) =>
		Promise.all(
			params.ids.map(id =>
				axiosWithAuth.delete(
					`${apiUrl}/${resource}/${encodeURIComponent(id)}`,
					{
						headers: { 'Content-Type': 'text/plain' },
					}
				)
			)
		).then(responses => ({ data: responses.map(({ data }) => data.id) })),
});
