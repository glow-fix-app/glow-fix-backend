import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('google.oauthClientId'),
      clientSecret: configService.get<string>('google.oauthClientSecret'),
      callbackURL: configService.get<string>('google.oauthCallbackUrl'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    const { id, name, emails, photos } = profile;

    const user = {
      providerId: id,
      email: emails?.[0]?.value || '',
      name: `${name?.givenName || ''} ${name?.familyName || ''}`.trim(),
      profilePhoto: photos?.[0]?.value || undefined,
    };

    done(null, user);
  }
}