'use client';

import React, { useState, forwardRef, useMemo, ComponentProps } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import './quil-editor.scss';
import cn from 'clsx';
import { Label } from '../label';
import { Sources } from 'quill';
import { convertLengthLeft } from './convert-length-left';
import { axiosWithAuth } from '@/api';
import ReactQuillType from 'react-quill';

const ReactQuill = dynamic(
	async () => {
		const { default: RQ } = await import('react-quill');
		return ({ forwardedRef, ...props }: any) => <RQ ref={forwardedRef} {...props} />;
	},
	{ ssr: false }
);

interface IQuilEditorProps extends Omit<ComponentProps<typeof ReactQuillType>, 'ref'> {
	label?: string;
	maxLength?: number;
	error?: boolean;
	helperText?: string;
	setIsError?: (isError: boolean) => void;
	required?: boolean;
	divProps?: React.HTMLAttributes<HTMLDivElement>;
}

export const QuilEditor = forwardRef<any, IQuilEditorProps>(
	(
		{
			label,
			required,
			helperText,
			error,
			className,
			onChange,
			divProps,
			...props
		},
		ref
	) => {
		const [editorText, setEditorText] = useState('');
		const [isFocused, setIsFocused] = useState(false);
		const [isError, setIsError] = useState(error || false);
		const [lengthError, setLengthError] = useState('');
		const lengthLeft = props.maxLength
			? convertLengthLeft(props.maxLength, editorText)
			: undefined;

		const quillRef = React.useRef<any>(null);

		const handleChange = (
			html: string,
			delta: any,
			source: Sources,
			editor: any
		) => {
			setEditorText(editor.getText().trimStart());
			let errorMsg = '';

			if (props.maxLength && editorText.length > props.maxLength) {
				errorMsg = `Максимальная длина: ${props.maxLength} символов.`;
			}

			if (errorMsg) {
				setLengthError(errorMsg);
				setIsError(true);
			} else {
				setLengthError('');
				setIsError(false);
			}

			if (props?.setIsError) {
				props?.setIsError(isError);
			}

			onChange?.(html, delta, source, editor);
		};

		const handleImageUpload = () => {
			const quill = quillRef.current?.getEditor();
			if (!quill) return;

			const input = document.createElement('input');
			input.setAttribute('type', 'file');
			input.setAttribute('accept', 'image/*');
			input.click();

			input.onchange = async () => {
				if (input.files && input.files[0]) {
					const file = input.files[0];

					const maxSizeInMB = 5;
					if (file.size > maxSizeInMB * 1024 * 1024) {
						alert(`Размер файла должен быть не более ${maxSizeInMB} МБ`);
						return;
					}

					const formData = new FormData();
					formData.append('file', file);

					const { data } = await axiosWithAuth.post('/files/upload', formData, {
						headers: {
							'Content-Type': 'multipart/form-data',
						},
					});

					const imageUrl = data.filePath;

					const range = quill.getSelection();
					if (range) {
						quill.insertEmbed(range.index, 'image', imageUrl);
					}
				}
			};
		};

		const modules = useMemo(
			() => ({
				toolbar: {
					container: [
						[
							'image',
							'video',
							'link',
							'code',
							'blockquote',
							{ list: 'ordered' },
							{ list: 'bullet' },
						],
					],
					handlers: {
						image: handleImageUpload,
					},
				},
			}),
			[]
		);

		return (
			<div {...divProps} className={cn('w-full', divProps?.className)}>
				{label && (
					<div className='flex justify-between'>
						<Label
							className='text-[18px] font-semibold text-black mb-1'
							htmlFor={props.id}
						>
							{label} {required && <span className='text-red-600'>*</span>}
						</Label>
						{lengthLeft !== undefined && (
							<div className={cn(isError && 'text-red-600')}>{lengthLeft}</div>
						)}
					</div>
				)}
				<ReactQuill
					className={cn(
						'react-quil flex flex-col-reverse transition max-w-full w-full h-auto border border-solid border-gray-400',
						isFocused && !error && !isError && 'border-gray-950',
						(isError || error) && 'border-red-600',
						className
					)}
					value={editorText}
					onChange={handleChange}
					modules={modules}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
					forwardedRef={quillRef}
					{...props}
				/>
				{isError && lengthError && (
					<p className='text-red-600 text-sm mt-1'>{lengthError}</p>
				)}
				{helperText && (
					<p className='text-red-600 text-sm mt-1'>{helperText}</p>
				)}
			</div>
		);
	}
);

QuilEditor.displayName = 'QuilEditor';