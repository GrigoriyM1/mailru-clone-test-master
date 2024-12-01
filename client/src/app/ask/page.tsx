'use client';

// import Link from 'next/link';
// import Box from '@mui/material/Box';
// import Tab from '@mui/material/Tab';
// import TabContext from '@mui/lab/TabContext';
// import TabList from '@mui/lab/TabList';
// import TabPanel from '@mui/lab/TabPanel';
import { useState } from 'react';
import { QuestionAsk } from '@/components/shared';
// import { Survey } from '@/components/shared';

const AskPage = () => {
	const [value, setValue] = useState<string>('question');

	const handleChange = (_e: React.SyntheticEvent, newValue: string) => {
		setValue(newValue);
	};

	return (
		<div className='flex'>
			<div className='max-w-[280px] w-full p-4'>
				{/* <div>
					<Link href='/smstop'>Вопросы-лидеры</Link>
				</div> */}
			</div>
			{/* TODO: ТУТ ДРУГОЙ SIDEBAR */}

			<div className='bg-white p-10 w-full'>
				<h1 className='text-[25px] mb-3'>Задать вопрос</h1>

				{/* <Box> */}
				{/* <TabContext value={value}> */}
				{/* <Box className='mb-10'>
							<TabList onChange={handleChange}>
								<Tab label='Вопрос' value='question' defaultChecked /> */}
				{/* <Tab label='Опрос' value='survey' /> */}
				{/* </TabList>
						</Box> */}
				{/* <TabPanel value='question' sx={{ padding: 0 }}> */}
				{/* <Question /> */}
				{/* </TabPanel> */}
				{/* <TabPanel value='survey' sx={{ padding: 0 }}>
							<Survey />
						</TabPanel> */}
				{/* </TabContext> */}
				{/* </Box> */}

				<QuestionAsk />
			</div>
		</div>
	);
};

export default AskPage;
