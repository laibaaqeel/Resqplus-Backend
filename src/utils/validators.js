// Real-world TLDs (IANA country codes + common generic TLDs).
// Used to reject syntactically valid but fake domains (e.g. "user@gmail.xom").
const VALID_TLDS = new Set([
  // generic / sponsored TLDs
  'com','net','org','info','biz','name','pro','coop','museum','aero','jobs','mobi',
  'travel','tel','asia','cat','xxx','int','gov','edu','mil',
  // popular modern gTLDs
  'io','ai','app','dev','co','me','tv','cc','online','site','tech','store','shop',
  'xyz','club','live','world','agency','solutions','email','cloud','digital',
  'network','software','systems','services','company','group','team','work',
  'design','media','news','today','life','blog','guide','guru','help','host',
  'inc','ink','institute','link','llc','ltd','market','mba','money','online',
  'page','partners','party','place','press','pub','rest','review','rocks','run',
  'school','science','shop','social','space','store','studio','style','support',
  'tools','top','tours','town','university','video','vip','wiki','win','zone',
  // ISO-3166-1 country-code TLDs
  'ad','ae','af','ag','ai','al','am','ao','aq','ar','as','at','au','aw','ax','az',
  'ba','bb','bd','be','bf','bg','bh','bi','bj','bl','bm','bn','bo','bq','br','bs',
  'bt','bv','bw','by','bz','ca','cc','cd','cf','cg','ch','ci','ck','cl','cm','cn',
  'co','cr','cu','cv','cw','cx','cy','cz','de','dj','dk','dm','do','dz','ec','ee',
  'eg','eh','er','es','et','fi','fj','fk','fm','fo','fr','ga','gb','gd','ge','gf',
  'gg','gh','gi','gl','gm','gn','gp','gq','gr','gs','gt','gu','gw','gy','hk','hm',
  'hn','hr','ht','hu','id','ie','il','im','in','io','iq','ir','is','it','je','jm',
  'jo','jp','ke','kg','kh','ki','km','kn','kp','kr','kw','ky','kz','la','lb','lc',
  'li','lk','lr','ls','lt','lu','lv','ly','ma','mc','md','me','mf','mg','mh','mk',
  'ml','mm','mn','mo','mp','mq','mr','ms','mt','mu','mv','mw','mx','my','mz','na',
  'nc','ne','nf','ng','ni','nl','no','np','nr','nu','nz','om','pa','pe','pf','pg',
  'ph','pk','pl','pm','pn','pr','ps','pt','pw','py','qa','re','ro','rs','ru','rw',
  'sa','sb','sc','sd','se','sg','sh','si','sj','sk','sl','sm','sn','so','sr','ss',
  'st','sv','sx','sy','sz','tc','td','tf','tg','th','tj','tk','tl','tm','tn','to',
  'tr','tt','tv','tw','tz','ua','ug','uk','um','us','uy','uz','va','vc','ve','vg',
  'vi','vn','vu','wf','ws','ye','yt','za','zm','zw',
]);

const EMAIL_SHAPE_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  const trimmed = email.trim();
  if (!EMAIL_SHAPE_REGEX.test(trimmed)) return false;

  const domain = trimmed.split('@')[1];
  const tld = domain.split('.').pop().toLowerCase();
  return VALID_TLDS.has(tld);
}

const MIN_PASSWORD_LENGTH = 8;

function isValidPassword(password) {
  return typeof password === 'string' && password.length >= MIN_PASSWORD_LENGTH;
}

module.exports = { isValidEmail, isValidPassword, MIN_PASSWORD_LENGTH };
