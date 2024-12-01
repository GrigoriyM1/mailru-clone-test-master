import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib'

const buttonVariants = cva(
	'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50',
	{
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground hover:bg-primary/90',
				destructive:
					'bg-destructive text-destructive-foreground hover:bg-destructive/90',
				outline: 'bg-background hover:bg-accent text-primary',
				secondary:
					'bg-secondary text-secondary-foreground hover:bg-secondary/80',
				ghost:
					'bg-accent hover:bg-accent hover:text-accent-foreground hover:bg-gray-200 transition',
				link: 'text-primary underline-offset-4 hover:underline',
			},
			size: {
				default: 'h-10 px-4 py-2',
				sm: 'rounded-md py-1 px-2 text-[13px]',
				lg: 'h-11 rounded-md px-8',
				icon: 'h-10 w-10',
				normal: 'p-1',
			},
			isLoading: {
				true: 'opacity-50 cursor-not-allowed',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
			isLoading: false,
		},
	}
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant,
			size,
			asChild = false,
			isLoading = false,
			children,
			...props
		},
		ref
	) => {
		const Comp = asChild ? Slot : 'button';
		return (
			<Comp
				className={cn(
					buttonVariants({ variant, size, isLoading, className }),
					isLoading && 'disabled'
				)}
				ref={ref}
				disabled={isLoading}
				{...props}
			>
				{isLoading ? (
					<>
						<svg
							className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
						>
							<circle
								className='opacity-25'
								cx='12'
								cy='12'
								r='10'
								stroke='currentColor'
								strokeWidth='4'
							></circle>
							<path
								className='opacity-75'
								fill='currentColor'
								d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
							></path>
						</svg>
						Загрузка...
					</>
				) : (
					children
				)}
			</Comp>
		);
	}
);
Button.displayName = 'Button';

export { Button, buttonVariants };
