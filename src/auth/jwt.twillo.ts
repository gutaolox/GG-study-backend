import * as twilio from 'twilio';

export const generateTwilloToken = (username, room) => {
  const VideoGrant = twilio.jwt.AccessToken.VideoGrant;

  // Substitute your Twilio AccountSid and ApiKey details
  const ACCOUNT_SID = 'ACcd71a690f1ea33e6b1bcae3eeec5cc64';
  const API_KEY_SID = 'SKbbc0f64278192c60eb62f1ed7997dcac';
  const API_KEY_SECRET = 'GIFSYfCcf2OOfTEIKlOyvCCPksyrPhGR';

  // Create an Access Token
  const accessToken = new twilio.jwt.AccessToken(
    ACCOUNT_SID,
    API_KEY_SID,
    API_KEY_SECRET,
  );

  // Set the Identity of this token
  accessToken.identity = username;

  // Grant access to Video
  const grant = new VideoGrant();
  grant.room = room;
  accessToken.addGrant(grant);

  return accessToken.toJwt();
};
