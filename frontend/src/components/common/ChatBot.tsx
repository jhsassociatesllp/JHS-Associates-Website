import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { MessageCircle, X, Send, Bot, User, Languages, Check, Mail, MapPin } from 'lucide-react'
import { LANGUAGES } from '../../i18n/googleTranslate'
import './ChatBot.css'

interface ChatLink {
  url: string
  label: string
}

/** A team member's contact card — built entirely by the backend (see
 * chatbot-backend/lib/people.js) so name, role, location and email are
 * exactly what the website lists. */
interface ChatPerson {
  name: string
  role: string
  location: string
  creds: string
  expertise: string
  specialisations: string
  email: string
  emailIsGeneral: boolean
  actions: ChatLink[]
}

interface ChatMessage {
  id: string
  role: 'bot' | 'user'
  text: string
  links?: ChatLink[]
  person?: ChatPerson
}

type LangCode = (typeof LANGUAGES)[number]['code']

const RTL_LANGS: LangCode[] = ['ur', 'ar']

/**
 * Short, generic chat-UI copy only (no legal/financial/compliance content),
 * hand-translated per the site's own language list in i18n/googleTranslate.ts.
 * Once the real chatbot API is wired in, these mock strings/keyword lists
 * go away — the API will handle language detection & response generation.
 */
interface ChatStrings {
  choosePrompt: string
  welcome: string
  online: string
  placeholder: string
  changeLanguage: string
  qrServices: string
  qrAbout: string
  qrContact: string
  qrCareers: string
  respServices: string
  respAbout: string
  respContact: string
  respCareers: string
  respOffices: string
  respFallback: string
}

const TRANSLATIONS: Record<LangCode, ChatStrings> = {
  en: {
    choosePrompt: 'Please choose your language to chat with me.',
    welcome: "Hello! I'm the JHS & Associates virtual assistant. Ask me about our services, offices, or how to get in touch — I'm happy to help.",
    online: 'Online',
    placeholder: 'Type your message...',
    changeLanguage: 'Change language',
    qrServices: 'Our Services',
    qrAbout: 'About JHS & Associates',
    qrContact: 'Contact Details',
    qrCareers: 'Career Opportunities',
    respServices: 'We offer Outsourcing, Consulting, Taxation, Assurance, IT Assurance, Corporate Finance and more. Which area would you like to know more about?',
    respAbout: 'JHS & Associates LLP is a professional services firm helping businesses with audit, tax, and advisory needs across India and globally.',
    respContact: "You can reach us through our Contact page, or I can point you to the office nearest you — just let me know your city.",
    respCareers: "We're always looking for talented people! Check the Careers section under About Us for our current openings.",
    respOffices: 'We have offices across Mumbai, Delhi, Bengaluru, Gujarat, Hyderabad, Kolkata, Chennai and a global presence — see Our Offices for the full list.',
    respFallback: "Thanks for your message! This assistant is still learning — for detailed queries, please reach out via our Contact page and our team will get back to you shortly.",
  },
  hi: {
    choosePrompt: 'कृपया मुझसे बात करने के लिए अपनी भाषा चुनें।',
    welcome: 'नमस्ते! मैं JHS & Associates का वर्चुअल असिस्टेंट हूं। हमारी सेवाओं, कार्यालयों या संपर्क करने के तरीके के बारे में मुझसे पूछें — मुझे मदद करने में खुशी होगी।',
    online: 'ऑनलाइन',
    placeholder: 'अपना संदेश लिखें...',
    changeLanguage: 'भाषा बदलें',
    qrServices: 'हमारी सेवाएं',
    qrAbout: 'JHS & Associates के बारे में',
    qrContact: 'संपर्क विवरण',
    qrCareers: 'करियर अवसर',
    respServices: 'हम आउटसोर्सिंग, कंसल्टिंग, टैक्सेशन, एश्योरेंस, IT एश्योरेंस, कॉर्पोरेट फाइनेंस और अन्य सेवाएं प्रदान करते हैं। आप किस क्षेत्र के बारे में अधिक जानना चाहेंगे?',
    respAbout: 'JHS & Associates LLP एक प्रोफेशनल सर्विसेज फर्म है जो भारत और वैश्विक स्तर पर व्यवसायों को ऑडिट, टैक्स और एडवाइजरी सेवाएं प्रदान करती है।',
    respContact: 'आप हमारे Contact पेज के माध्यम से हमसे संपर्क कर सकते हैं, या मुझे अपना शहर बताएं, मैं आपको नजदीकी कार्यालय बता सकता हूं।',
    respCareers: 'हम हमेशा प्रतिभाशाली लोगों की तलाश में रहते हैं! वर्तमान अवसरों के लिए About Us के अंतर्गत Careers सेक्शन देखें।',
    respOffices: 'हमारे कार्यालय मुंबई, दिल्ली, बेंगलुरु, गुजरात, हैदराबाद, कोलकाता, चेन्नई और वैश्विक स्तर पर हैं — पूरी सूची के लिए Our Offices देखें।',
    respFallback: 'आपके संदेश के लिए धन्यवाद! यह असिस्टेंट अभी सीख रहा है — विस्तृत जानकारी के लिए कृपया हमारे Contact पेज के माध्यम से संपर्क करें, हमारी टीम जल्द ही आपसे संपर्क करेगी।',
  },
  mr: {
    choosePrompt: 'कृपया माझ्याशी बोलण्यासाठी तुमची भाषा निवडा.',
    welcome: 'नमस्कार! मी JHS & Associates चा व्हर्च्युअल असिस्टंट आहे. आमच्या सेवा, कार्यालये किंवा संपर्क साधण्याबद्दल मला विचारा — मला मदत करण्यात आनंद होईल.',
    online: 'ऑनलाइन',
    placeholder: 'तुमचा संदेश टाइप करा...',
    changeLanguage: 'भाषा बदला',
    qrServices: 'आमच्या सेवा',
    qrAbout: 'JHS & Associates बद्दल',
    qrContact: 'संपर्क तपशील',
    qrCareers: 'करिअर संधी',
    respServices: 'आम्ही आउटसोर्सिंग, कन्सल्टिंग, टॅक्सेशन, अ‍ॅश्युरन्स, आयटी अ‍ॅश्युरन्स, कॉर्पोरेट फायनान्स आणि इतर सेवा पुरवतो. तुम्हाला कोणत्या क्षेत्राबद्दल अधिक जाणून घ्यायचे आहे?',
    respAbout: 'JHS & Associates LLP ही एक व्यावसायिक सेवा कंपनी आहे जी भारतात आणि जागतिक स्तरावर व्यवसायांना ऑडिट, कर आणि सल्लागार सेवा पुरवते.',
    respContact: 'तुम्ही आमच्या Contact पेजद्वारे आमच्याशी संपर्क साधू शकता, किंवा मला तुमचे शहर सांगा, मी तुम्हाला जवळचे कार्यालय सांगतो.',
    respCareers: 'आम्ही नेहमी प्रतिभावान लोकांच्या शोधात असतो! सध्याच्या संधींसाठी About Us अंतर्गत Careers विभाग पहा.',
    respOffices: 'आमची कार्यालये मुंबई, दिल्ली, बंगळुरू, गुजरात, हैदराबाद, कोलकाता, चेन्नई आणि जागतिक स्तरावर आहेत — संपूर्ण यादीसाठी Our Offices पहा.',
    respFallback: 'तुमच्या संदेशाबद्दल धन्यवाद! हा असिस्टंट अजूनही शिकत आहे — सविस्तर माहितीसाठी कृपया आमच्या Contact पेजद्वारे संपर्क साधा, आमची टीम लवकरच तुमच्याशी संपर्क साधेल.',
  },
  gu: {
    choosePrompt: 'કૃપા કરીને મારી સાથે વાત કરવા માટે તમારી ભાષા પસંદ કરો.',
    welcome: 'નમસ્તે! હું JHS & Associates નો વર્ચ્યુઅલ આસિસ્ટન્ટ છું. અમારી સેવાઓ, ઓફિસો અથવા સંપર્ક કરવાની રીત વિશે મને પૂછો — મને મદદ કરવામાં આનંદ થશે.',
    online: 'ઓનલાઇન',
    placeholder: 'તમારો સંદેશ ટાઈપ કરો...',
    changeLanguage: 'ભાષા બદલો',
    qrServices: 'અમારી સેવાઓ',
    qrAbout: 'JHS & Associates વિશે',
    qrContact: 'સંપર્ક વિગતો',
    qrCareers: 'કારકિર્દી તકો',
    respServices: 'અમે આઉટસોર્સિંગ, કન્સલ્ટિંગ, ટેક્સેશન, એશ્યોરન્સ, IT એશ્યોરન્સ, કોર્પોરેટ ફાઇનાન્સ અને વધુ સેવાઓ પ્રદાન કરીએ છીએ. તમે કયા ક્ષેત્ર વિશે વધુ જાણવા માંગો છો?',
    respAbout: 'JHS & Associates LLP એક પ્રોફેશનલ સર્વિસીસ ફર્મ છે જે ભારત અને વૈશ્વિક સ્તરે વ્યવસાયોને ઓડિટ, ટેક્સ અને એડવાઇઝરી સેવાઓ પ્રદાન કરે છે.',
    respContact: 'તમે અમારા Contact પેજ દ્વારા અમારો સંપર્ક કરી શકો છો, અથવા મને તમારું શહેર જણાવો, હું તમને નજીકની ઓફિસ જણાવીશ.',
    respCareers: 'અમે હંમેશા પ્રતિભાશાળી લોકોની શોધમાં હોઈએ છીએ! વર્તમાન તકો માટે About Us હેઠળ Careers વિભાગ જુઓ.',
    respOffices: 'અમારી ઓફિસો મુંબઈ, દિલ્હી, બેંગલુરુ, ગુજરાત, હૈદરાબાદ, કોલકાતા, ચેન્નાઈ અને વૈશ્વિક સ્તરે છે — સંપૂર્ણ યાદી માટે Our Offices જુઓ.',
    respFallback: 'તમારા સંદેશ માટે આભાર! આ આસિસ્ટન્ટ હજુ શીખી રહ્યું છે — વિગતવાર માહિતી માટે કૃપા કરીને અમારા Contact પેજ દ્વારા સંપર્ક કરો, અમારી ટીમ ટૂંક સમયમાં તમારો સંપર્ક કરશે.',
  },
  ur: {
    choosePrompt: 'براہ کرم مجھ سے بات کرنے کے لیے اپنی زبان منتخب کریں۔',
    welcome: 'السلام علیکم! میں JHS & Associates کا ورچوئل اسسٹنٹ ہوں۔ ہماری خدمات، دفاتر یا رابطہ کرنے کے طریقے کے بارے میں مجھ سے پوچھیں — مجھے مدد کرنے میں خوشی ہوگی۔',
    online: 'آن لائن',
    placeholder: 'اپنا پیغام لکھیں...',
    changeLanguage: 'زبان تبدیل کریں',
    qrServices: 'ہماری خدمات',
    qrAbout: 'JHS & Associates کے بارے میں',
    qrContact: 'رابطہ کی تفصیلات',
    qrCareers: 'کیریئر کے مواقع',
    respServices: 'ہم آؤٹ سورسنگ، کنسلٹنگ، ٹیکسیشن، ایشورنس، آئی ٹی ایشورنس، کارپوریٹ فنانس اور مزید خدمات فراہم کرتے ہیں۔ آپ کس شعبے کے بارے میں مزید جاننا چاہیں گے؟',
    respAbout: 'JHS & Associates LLP ایک پیشہ ورانہ خدمات کی فرم ہے جو بھارت اور عالمی سطح پر کاروباروں کو آڈٹ، ٹیکس اور مشاورتی خدمات فراہم کرتی ہے۔',
    respContact: 'آپ ہمارے Contact پیج کے ذریعے ہم سے رابطہ کر سکتے ہیں، یا مجھے اپنا شہر بتائیں، میں آپ کو قریب ترین دفتر بتا دوں گا۔',
    respCareers: 'ہم ہمیشہ باصلاحیت افراد کی تلاش میں رہتے ہیں! موجودہ مواقع کے لیے About Us کے تحت Careers سیکشن دیکھیں۔',
    respOffices: 'ہمارے دفاتر ممبئی، دہلی، بنگلورو، گجرات، حیدرآباد، کولکاتا، چنئی اور عالمی سطح پر موجود ہیں — مکمل فہرست کے لیے Our Offices دیکھیں۔',
    respFallback: 'آپ کے پیغام کا شکریہ! یہ اسسٹنٹ ابھی سیکھ رہا ہے — تفصیلی معلومات کے لیے براہ کرم ہمارے Contact پیج کے ذریعے رابطہ کریں، ہماری ٹیم جلد آپ سے رابطہ کرے گی۔',
  },
  ar: {
    choosePrompt: 'الرجاء اختيار لغتك للتحدث معي.',
    welcome: 'مرحبًا! أنا المساعد الافتراضي لشركة JHS & Associates. اسألني عن خدماتنا أو مكاتبنا أو كيفية التواصل معنا — يسعدني مساعدتك.',
    online: 'متصل الآن',
    placeholder: 'اكتب رسالتك...',
    changeLanguage: 'تغيير اللغة',
    qrServices: 'خدماتنا',
    qrAbout: 'عن JHS & Associates',
    qrContact: 'تفاصيل الاتصال',
    qrCareers: 'فرص العمل',
    respServices: 'نقدم خدمات الاستعانة بمصادر خارجية، الاستشارات، الضرائب، التأكيد، تأكيد تقنية المعلومات، التمويل المؤسسي والمزيد. ما هو المجال الذي ترغب بمعرفة المزيد عنه؟',
    respAbout: 'JHS & Associates LLP هي شركة خدمات مهنية تساعد الشركات في مجالات التدقيق والضرائب والاستشارات في الهند وعالميًا.',
    respContact: 'يمكنك التواصل معنا عبر صفحة الاتصال، أو أخبرني بمدينتك وسأدلك على أقرب مكتب.',
    respCareers: "نبحث دائمًا عن أشخاص موهوبين! تحقق من قسم الوظائف ضمن 'من نحن' لمعرفة الفرص الحالية.",
    respOffices: 'لدينا مكاتب في مومباي ودلهي وبنغالورو وغوجارات وحيدر أباد وكولكاتا وتشيناي بالإضافة إلى تواجد عالمي — راجع صفحة مكاتبنا للقائمة الكاملة.',
    respFallback: 'شكرًا لرسالتك! لا يزال هذا المساعد قيد التعلم — لمزيد من التفاصيل، يرجى التواصل معنا عبر صفحة الاتصال وسيقوم فريقنا بالرد عليك قريبًا.',
  },
  ta: {
    choosePrompt: 'என்னுடன் பேச உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்.',
    welcome: 'வணக்கம்! நான் JHS & Associates இன் மெய்நிகர் உதவியாளர். எங்கள் சேவைகள், அலுவலகங்கள் அல்லது தொடர்பு கொள்ளும் முறை பற்றி என்னிடம் கேளுங்கள் — உதவ மகிழ்ச்சி.',
    online: 'ஆன்லைனில் உள்ளது',
    placeholder: 'உங்கள் செய்தியை தட்டச்சு செய்யவும்...',
    changeLanguage: 'மொழியை மாற்று',
    qrServices: 'எங்கள் சேவைகள்',
    qrAbout: 'JHS & Associates பற்றி',
    qrContact: 'தொடர்பு விவரங்கள்',
    qrCareers: 'வேலை வாய்ப்புகள்',
    respServices: 'நாங்கள் அவுட்சோர்சிங், கன்சல்டிங், வரிவிதிப்பு, அஷ்யூரன்ஸ், ஐடி அஷ்யூரன்ஸ், கார்ப்பரேட் ஃபைனான்ஸ் மற்றும் பலவற்றை வழங்குகிறோம். எந்தத் துறையைப் பற்றி மேலும் அறிய விரும்புகிறீர்கள்?',
    respAbout: 'JHS & Associates LLP என்பது இந்தியாவிலும் உலகளாவிய அளவிலும் தணிக்கை, வரி மற்றும் ஆலோசனை சேவைகளை வழங்கும் ஒரு தொழில்முறை சேவை நிறுவனம்.',
    respContact: 'எங்கள் Contact பக்கம் மூலம் எங்களைத் தொடர்பு கொள்ளலாம், அல்லது உங்கள் நகரத்தைச் சொல்லுங்கள், அருகிலுள்ள அலுவலகத்தை நான் தெரிவிக்கிறேன்.',
    respCareers: 'நாங்கள் எப்போதும் திறமையான நபர்களைத் தேடுகிறோம்! தற்போதைய வாய்ப்புகளுக்கு About Us பிரிவின் கீழ் Careers பகுதியைப் பாருங்கள்.',
    respOffices: 'எங்கள் அலுவலகங்கள் மும்பை, டெல்லி, பெங்களூரு, குஜராத், ஹைதராபாத், கொல்கத்தா, சென்னை மற்றும் உலகளாவிய ரீதியில் உள்ளன — முழு பட்டியலுக்கு Our Offices பக்கத்தைப் பாருங்கள்.',
    respFallback: 'உங்கள் செய்திக்கு நன்றி! இந்த உதவியாளர் இன்னும் கற்றுக்கொண்டிருக்கிறது — விரிவான கேள்விகளுக்கு எங்கள் Contact பக்கம் மூலம் தொடர்பு கொள்ளுங்கள், எங்கள் குழு விரைவில் பதிலளிக்கும்.',
  },
  te: {
    choosePrompt: 'నాతో మాట్లాడటానికి దయచేసి మీ భాషను ఎంచుకోండి.',
    welcome: 'నమస్కారం! నేను JHS & Associates వర్చువల్ అసిస్టెంట్‌ని. మా సేవలు, కార్యాలయాలు లేదా సంప్రదించే విధానం గురించి నన్ను అడగండి — సహాయం చేయడానికి సంతోషిస్తాను.',
    online: 'ఆన్‌లైన్‌లో ఉంది',
    placeholder: 'మీ సందేశాన్ని టైప్ చేయండి...',
    changeLanguage: 'భాషను మార్చండి',
    qrServices: 'మా సేవలు',
    qrAbout: 'JHS & Associates గురించి',
    qrContact: 'సంప్రదింపు వివరాలు',
    qrCareers: 'కెరీర్ అవకాశాలు',
    respServices: 'మేము అవుట్‌సోర్సింగ్, కన్సల్టింగ్, టాక్సేషన్, అష్యూరెన్స్, ఐటీ అష్యూరెన్స్, కార్పొరేట్ ఫైనాన్స్ మరియు మరిన్ని సేవలను అందిస్తాము. మీరు ఏ రంగం గురించి మరింత తెలుసుకోవాలనుకుంటున్నారు?',
    respAbout: 'JHS & Associates LLP అనేది భారతదేశంలో మరియు ప్రపంచవ్యాప్తంగా వ్యాపారాలకు ఆడిట్, పన్ను మరియు సలహా సేవలను అందించే ఒక ప్రొఫెషనల్ సర్వీసెస్ సంస్థ.',
    respContact: 'మీరు మా Contact పేజీ ద్వారా మమ్మల్ని సంప్రదించవచ్చు, లేదా మీ నగరాన్ని చెప్పండి, నేను మీకు దగ్గరలోని కార్యాలయాన్ని తెలియజేస్తాను.',
    respCareers: 'మేము ఎల్లప్పుడూ ప్రతిభావంతులైన వ్యక్తుల కోసం చూస్తున్నాము! ప్రస్తుత అవకాశాల కోసం About Us కింద Careers విభాగాన్ని చూడండి.',
    respOffices: 'మా కార్యాలయాలు ముంబై, ఢిల్లీ, బెంగళూరు, గుజరాత్, హైదరాబాద్, కోల్‌కతా, చెన్నై మరియు ప్రపంచవ్యాప్తంగా ఉన్నాయి — పూర్తి జాబితా కోసం Our Offices చూడండి.',
    respFallback: 'మీ సందేశానికి ధన్యవాదాలు! ఈ అసిస్టెంట్ ఇంకా నేర్చుకుంటోంది — వివరణాత్మక ప్రశ్నల కోసం దయచేసి మా Contact పేజీ ద్వారా సంప్రదించండి, మా బృందం త్వరలో మిమ్మల్ని సంప్రదిస్తుంది.',
  },
}

const CHATBOT_API_URL = `${(import.meta.env.VITE_CHATBOT_API_BASE_URL as string) || '/chatbot-api'}/chat`

interface ChatApiItem {
  text: string
  link?: ChatLink | null
  links?: ChatLink[]
  person?: ChatPerson
}

interface ChatApiResult {
  reply: string
  links: ChatLink[]
  items?: ChatApiItem[]
  people?: ChatPerson[]
}

/** A [[LINK: ...]] marker still mid-stream — hide it rather than flash the
 * literal raw marker text on screen while it's still being generated. */
function stripPendingLinkMarkers(text: string): string {
  return text.replace(/\[\[LINK:[\s\S]*$/, '').replace(/\[\[LINK:\s*.*?\s*\|\s*.*?\]\]/g, '')
}

/**
 * Talks to the website-content chatbot backend (see chatbot-backend/ at the
 * repo root — a separate Node.js service, not the main FastAPI backend).
 * Two response shapes come back, mirroring that service's own client
 * (chatbot-backend/public/widget.js):
 *  - text/event-stream: a genuine AI answer, streamed token by token —
 *    onDelta is called with the progressively-growing text so the UI can
 *    show it arriving live, same as widget.js's own behavior.
 *  - a single JSON body: the two deterministic paths (team lists, content
 *    counts) that need no AI call and return everything at once, optionally
 *    with `items` — one line per person/article, each with its own link.
 */
/** Gives up if the server sends nothing for this long (a dropped connection or a
 * restarted server would otherwise leave the chat spinning and locked forever). */
const CHATBOT_STALL_MS = 45000

async function askChatbot(
  message: string,
  history: { role: 'bot' | 'user'; text: string }[],
  onDelta: (partial: string) => void
): Promise<ChatApiResult> {
  const controller = new AbortController()
  let stallTimer = setTimeout(() => controller.abort(), CHATBOT_STALL_MS)
  const keepAlive = () => {
    clearTimeout(stallTimer)
    stallTimer = setTimeout(() => controller.abort(), CHATBOT_STALL_MS)
  }
  try {
    return await askChatbotInner(message, history, onDelta, controller.signal, keepAlive)
  } finally {
    clearTimeout(stallTimer)
  }
}

async function askChatbotInner(
  message: string,
  history: { role: 'bot' | 'user'; text: string }[],
  onDelta: (partial: string) => void,
  signal: AbortSignal,
  keepAlive: () => void
): Promise<ChatApiResult> {
  const res = await fetch(CHATBOT_API_URL, {
    method: 'POST',
    signal,
    headers: { 'Content-Type': 'application/json' },
    // The last few messages let the server understand follow-ups like "please mention few names".
    body: JSON.stringify({ message, history }),
  })
  if (!res.ok) throw new Error('Chatbot request failed')

  const contentType = res.headers.get('content-type') || ''

  if (contentType.includes('text/event-stream') && res.body) {
    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let raw = ''
    let buffer = ''
    let final: ChatApiResult | null = null

    while (true) {
      const { done, value } = await reader.read()
      keepAlive()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const frames = buffer.split('\n\n')
      buffer = frames.pop() ?? ''
      for (const frame of frames) {
        const line = frame.trim()
        if (!line.startsWith('data:')) continue
        const payload = JSON.parse(line.slice(5).trim())
        if (payload.delta) {
          raw += payload.delta
          onDelta(stripPendingLinkMarkers(raw))
        } else if (payload.done) {
          final = { reply: payload.reply, links: payload.links ?? (payload.link ? [payload.link] : []), people: payload.people }
        } else if (payload.error) {
          throw new Error(payload.error)
        }
      }
    }
    if (!final) throw new Error('Chatbot stream ended unexpectedly')
    return final
  }

  const data = await res.json()
  if (data.error) throw new Error(data.error)
  return {
    reply: data.reply,
    links: data.links ?? (data.link ? [data.link] : []),
    items: data.items,
    people: data.people,
  }
}

/** **bold** within a single line — the only inline marker the backend's
 * SYSTEM_PROMPT is told to use (see chatbot-backend/server.js). */
function boldify(line: string, keyPrefix: string): ReactNode[] {
  return line.split(/(\*\*.+?\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={`${keyPrefix}-${i}`}>{part.slice(2, -2)}</strong>
    ) : (
      <span key={`${keyPrefix}-${i}`}>{part}</span>
    )
  )
}

/** Lightweight markdown for a chat bubble: "## "/"#### " headings, "- "/"* "
 * bullet lists, **bold**, and line breaks — mirrors what chatbot-backend's
 * SYSTEM_PROMPT is instructed to use for a longer, multi-part answer (see
 * chatbot-backend/public/widget.js's renderText for the reference client).
 * Returns React nodes (not raw HTML) so JSX's own text-escaping keeps this
 * safe with no manual sanitization needed. */
function renderChatText(text: string): ReactNode {
  const lines = text.split('\n')
  const nodes: ReactNode[] = []
  let listItems: ReactNode[] = []
  const flushList = () => {
    if (listItems.length) {
      nodes.push(<ul key={`ul-${nodes.length}`} className="chatbot__bubble-list">{listItems}</ul>)
      listItems = []
    }
  }
  lines.forEach((line, idx) => {
    const heading = line.match(/^#{2,3}\s+(.*)/)
    const subheading = line.match(/^#{4,6}\s+(.*)/)
    const bullet = line.match(/^[-*]\s+(.*)/)
    if (heading) {
      flushList()
      nodes.push(<h4 key={idx} className="chatbot__bubble-heading">{boldify(heading[1], `h${idx}`)}</h4>)
    } else if (subheading) {
      flushList()
      nodes.push(<h5 key={idx} className="chatbot__bubble-subheading">{boldify(subheading[1], `sh${idx}`)}</h5>)
    } else if (bullet) {
      listItems.push(<li key={idx}>{boldify(bullet[1], `li${idx}`)}</li>)
    } else {
      flushList()
      nodes.push(
        <span key={idx}>
          {line.trim() === '' ? '' : boldify(line, `l${idx}`)}
          <br />
        </span>
      )
    }
  })
  flushList()
  return nodes
}

/** One team member: name, role · location, credentials, expertise, email and
 * the View Profile / Connect buttons — the same layout for every person, so
 * details never drift away from the buttons that belong to them. */
function PersonCard({ person }: { person: ChatPerson }) {
  return (
    <div className="chatbot__person">
      <p className="chatbot__person-name">{person.name}</p>
      <p className="chatbot__person-meta">
        {person.role}
        {person.location && (
          <>
            {' · '}
            <MapPin size={12} aria-hidden="true" /> {person.location}
          </>
        )}
      </p>
      {person.creds && <p className="chatbot__person-creds">{person.creds}</p>}
      {person.expertise && <p className="chatbot__person-desc">{person.expertise}</p>}
      {person.specialisations && (
        <p className="chatbot__person-desc">
          <strong>Specialisations:</strong> {person.specialisations}
        </p>
      )}
      <p className="chatbot__person-email">
        <Mail size={13} aria-hidden="true" />
        <a href={`mailto:${person.email}`}>{person.email}</a>
        {person.emailIsGeneral && <span className="chatbot__person-general">(firm's general email)</span>}
      </p>
      <ChatLinkButtons links={person.actions} />
    </div>
  )
}

function ChatLinkButtons({ links }: { links?: ChatLink[] }) {
  if (!links || links.length === 0) return null
  return (
    <div className="chatbot__bubble-links">
      {links.map((link) => (
        <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="chatbot__bubble-link">
          {link.label}
        </a>
      ))}
    </div>
  )
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [chatLanguage, setChatLanguage] = useState<LangCode | null>(null)
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const [showTopicQuickReplies, setShowTopicQuickReplies] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'choose-lang', role: 'bot', text: 'Please choose your language to chat with me.' },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const langMenuRef = useRef<HTMLDivElement>(null)

  const strings = TRANSLATIONS[chatLanguage ?? 'en']
  const isRtl = chatLanguage ? RTL_LANGS.includes(chatLanguage) : false

  useEffect(() => {
    if (!isOpen) return
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isOpen, isTyping])

  useEffect(() => {
    if (!langMenuOpen) return
    const onClickOutside = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [langMenuOpen])

  const chooseLanguage = (code: LangCode) => {
    const label = LANGUAGES.find((l) => l.code === code)?.nativeLabel ?? code
    setChatLanguage(code)
    setLangMenuOpen(false)
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: 'user', text: label },
      { id: crypto.randomUUID(), role: 'bot', text: TRANSLATIONS[code].welcome },
    ])
    setShowTopicQuickReplies(true)
  }

  const changeLanguage = (code: LangCode) => {
    if (code === chatLanguage) {
      setLangMenuOpen(false)
      return
    }
    setChatLanguage(code)
    setLangMenuOpen(false)
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'bot', text: TRANSLATIONS[code].welcome }])
    setShowTopicQuickReplies(true)
  }

  const sendMessage = async (rawText: string) => {
    const text = rawText.trim()
    if (!text || isTyping || !chatLanguage) return

    // Recent conversation (before this message), sent along so follow-up questions make sense.
    const history = messages
      .filter((m) => m.id !== 'choose-lang')
      .slice(-8)
      .map((m) => ({
        role: m.role,
        text: m.person ? `${m.person.name} — ${m.person.role}, ${m.person.location}` : m.text,
      }))
      .filter((m) => m.text.trim())

    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: 'user', text }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setShowTopicQuickReplies(false)
    setIsTyping(true)

    // Only added to the message list once real content exists (first
    // streamed token, or the final answer for a non-streamed path) — not
    // upfront — so an empty bubble never sits alongside the "typing…" dots.
    let botMessageId: string | null = null

    const onDelta = (partial: string) => {
      if (botMessageId === null) {
        const newId = crypto.randomUUID()
        botMessageId = newId
        setMessages((prev) => [...prev, { id: newId, role: 'bot', text: partial }])
      } else {
        const currentId = botMessageId
        setMessages((prev) => prev.map((m) => (m.id === currentId ? { ...m, text: partial } : m)))
      }
    }

    try {
      const result = await askChatbot(text, history, onDelta)

      // Contact cards for anyone named in an AI-written answer.
      const personMessages: ChatMessage[] = (result.people ?? []).map((person) => ({
        id: crypto.randomUUID(),
        role: 'bot',
        text: '',
        person,
      }))

      setMessages((prev) => {
        const finalized = botMessageId
          ? prev.map((m) => (m.id === botMessageId ? { ...m, text: result.reply, links: result.links } : m))
          : [...prev, { id: crypto.randomUUID(), role: 'bot' as const, text: result.reply, links: result.links }]

        if (!result.items || result.items.length === 0) return [...finalized, ...personMessages]

        // A list item is either a plain line (headers, closing questions) or a
        // team member, shown as a contact card with their own buttons.
        const itemMessages: ChatMessage[] = result.items.map((item) => ({
          id: crypto.randomUUID(),
          role: 'bot',
          text: item.person ? '' : item.text,
          links: item.person ? undefined : item.links?.length ? item.links : item.link ? [item.link] : undefined,
          person: item.person,
        }))
        return [...finalized, ...itemMessages, ...personMessages]
      })
    } catch {
      const errorText = "Sorry, I couldn't reach the assistant right now. Please try again in a moment."
      setMessages((prev) =>
        botMessageId
          ? prev.map((m) => (m.id === botMessageId ? { ...m, text: errorText } : m))
          : [...prev, { id: crypto.randomUUID(), role: 'bot', text: errorText }]
      )
    } finally {
      setIsTyping(false)
    }
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    void sendMessage(input)
  }

  return (
    <div className="chatbot">
      {isOpen && (
        <div
          className="chatbot__panel"
          role="dialog"
          aria-label="JHS Associates chat assistant"
          data-lenis-prevent
          dir={isRtl ? 'rtl' : 'ltr'}
        >
          <div className="chatbot__header">
            <div className="chatbot__header-info">
              <span className="chatbot__avatar">
                <Bot size={20} />
              </span>
              <div>
                <p className="chatbot__title">JHS Assistant</p>
                <p className="chatbot__status">
                  <span className="chatbot__status-dot" />
                  {strings.online}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="chatbot__close"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>

          <div className="chatbot__messages">
            {messages.map((message) => (
              <div key={message.id} className={`chatbot__row chatbot__row--${message.role}`}>
                <span className="chatbot__bubble-icon">
                  {message.role === 'bot' ? <Bot size={14} /> : <User size={14} />}
                </span>
                <div className={`chatbot__bubble chatbot__bubble--${message.role}`}>
                  {message.person ? (
                    <PersonCard person={message.person} />
                  ) : (
                    <>
                      {message.role === 'bot' ? renderChatText(message.text) : message.text}
                      {message.role === 'bot' && <ChatLinkButtons links={message.links} />}
                    </>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="chatbot__row chatbot__row--bot">
                <span className="chatbot__bubble-icon">
                  <Bot size={14} />
                </span>
                <div className="chatbot__bubble chatbot__bubble--bot chatbot__bubble--typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {!chatLanguage && (
            <div className="chatbot__quick-replies">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  className="chatbot__quick-reply"
                  onClick={() => chooseLanguage(lang.code)}
                >
                  {lang.nativeLabel}
                </button>
              ))}
            </div>
          )}

          {chatLanguage && showTopicQuickReplies && (
            <div className="chatbot__quick-replies">
              {[strings.qrServices, strings.qrAbout, strings.qrContact, strings.qrCareers].map((reply) => (
                <button
                  key={reply}
                  type="button"
                  className="chatbot__quick-reply"
                  onClick={() => void sendMessage(reply)}
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          {chatLanguage && (
            <form className="chatbot__input-row" onSubmit={handleSubmit}>
              <div className="chatbot__lang-pill-wrap" ref={langMenuRef}>
                <button
                  type="button"
                  className="chatbot__lang-pill"
                  onClick={() => setLangMenuOpen((v) => !v)}
                  aria-haspopup="listbox"
                  aria-expanded={langMenuOpen}
                  aria-label={strings.changeLanguage}
                  title={strings.changeLanguage}
                >
                  <Languages size={14} />
                  <span>{chatLanguage.toUpperCase()}</span>
                </button>

                {langMenuOpen && (
                  <ul className="chatbot__lang-menu" role="listbox">
                    {LANGUAGES.map((lang) => (
                      <li key={lang.code}>
                        <button
                          type="button"
                          className={`chatbot__lang-option ${lang.code === chatLanguage ? 'chatbot__lang-option--active' : ''}`}
                          role="option"
                          aria-selected={lang.code === chatLanguage}
                          onClick={() => changeLanguage(lang.code)}
                        >
                          <span>{lang.nativeLabel}</span>
                          {lang.code === chatLanguage && <Check size={13} />}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <input
                type="text"
                className="chatbot__input"
                placeholder={strings.placeholder}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                aria-label={strings.placeholder}
                autoComplete="off"
              />
              <button
                type="submit"
                className="chatbot__send"
                disabled={!input.trim() || isTyping}
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </form>
          )}
        </div>
      )}

      <button
        type="button"
        className="chatbot__toggle"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? 'Close chat assistant' : 'Open chat assistant'}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={26} /> : <MessageCircle size={26} />}
      </button>
    </div>
  )
}
