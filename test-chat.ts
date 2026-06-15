import { NestFactory } from '@nestjs/core';
import { AppModule } from './server/src/app.module';
import { ChatService } from './server/src/modules/chat/chat.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const chatService = app.get(ChatService);
  
  try {
    const res = await chatService.createConversation({
      userId: 'ea5c3c36-62e7-4320-9ba8-93544af6cc37', // manager
      userRole: 'MANAGER',
      type: 'SUPPORT' as any,
    });
    console.log("SUCCESS:", res);
  } catch (e) {
    console.error("ERROR:", e);
  }
  await app.close();
}

bootstrap();
