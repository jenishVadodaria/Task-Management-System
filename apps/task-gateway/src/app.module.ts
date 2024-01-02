import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './jwt.strategy';
import { RolesGuard } from './roles.guard';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    ClientsModule.register([
      {
        name: 'USERS_PROXY',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: Number(process.env.USERS_PROXY_PORT) || 9002,
        },
      },
      {
        name: 'TASKS_PROXY',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: Number(process.env.TASKS_PROXY_PORT) || 9001,
        },
      },
    ]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWTSECRET || 'MYJWTSECRET',
      signOptions: {
        expiresIn: '7d',
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AccessTokenStrategy, RolesGuard],
})
export class AppModule {}
