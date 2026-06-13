import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InventoryModule } from './inventory/inventory.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        url: configService.get<string>('DB_URL'),
        entities: [],
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE'),
        autoLoadEntities: configService.get<boolean>('DB_AUTO_LOAD_ENTITIES'),
        ssl:
          configService.get<string>('DB_SSL_ENABLED') === 'true'
            ? { rejectUnauthorized: false }
            : false,
      }),
    }),
    InventoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
