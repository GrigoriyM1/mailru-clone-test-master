import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as express from 'express'
// import cookieParser from 'cookie-parser'; // добавить в tsconfig.json - "esModuleInterop": true
import { join } from 'path'
import { AppModule } from './app.module'
import { ResponseAddContentRangeToHeaderInterceptor } from './interceptors/response-add-content-range.interceptor'

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		rawBody: true // чтобы handleWebhook работал
	})

	// app.setGlobalPrefix('api')
	// app.use(cookieParser())
	app.enableCors({
		origin: [process.env.CLIENT_URL],
		credentials: true,
		// exposedHeaders: ['set-cookie'],
	})

	app.use('/uploads', express.static(join(__dirname, '..', 'tmp/uploads')))	
	app.use('/webhook', express.raw({ type: '*/*' })) // Это позволит получать raw body

	// swagger
	const config = new DocumentBuilder()
		.setTitle('Mailru clone example')
		.setDescription('Тесты api проекта')
		.setVersion('1.0')
		.addTag('mailru')
		.build()
	const document = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('docs', app, document)

	app.useGlobalInterceptors(new ResponseAddContentRangeToHeaderInterceptor())

	await app.listen(process.env.PORT! || 4200)
}
bootstrap()