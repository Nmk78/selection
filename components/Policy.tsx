"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Calculator, ChevronLeft, Users, UserCheck, Award, EqualApproximately, Info, TrendingUp, Scale, Languages } from "lucide-react";
import { Crown, Sparkles, ScrollText } from "lucide-react";

const translations = {
  en: {
    title: "Voting Policy",
    subtitle: "Understand how the selection process works",
    selectionProcess: "Selection Process",
    howScoresCalculated: "How Scores Are Calculated",
    studentVotes: "Student Votes",
    judgeRatings: "Judge Ratings",
    finalScoreCalc: "Final Score Calculation",
    normalization: "Step 1: Normalization",
    weightedCombination: "Step 2: Weighted Combination",
    exampleCalculation: "Example Calculation",
    transparency: "Transparency & Fairness",
    transparencyDesc: "This scoring system ensures that:",
    transparencyList: [
      "All candidates are evaluated on the same scale through normalization",
      "Both student votes and judge expertise are considered in the final decision",
      "The weighting (60% votes, 40% ratings) balances popular choice with expert evaluation",
      "No candidate is disadvantaged by having fewer total votes or ratings"
    ],
    contactInfo: "For more information, please contact the event organizers.",
    previous: "Previous",
    next: "Next",
    howToVote: "How to vote:",
    studentVoteDetails: [
      "Each student can vote for one male and one female candidate",
      "Each vote increments the candidate's vote count by 1",
      "Votes are counted as raw numbers (e.g., 100 votes = 100 total votes)",
      "Secret keys can only be used once per gender category"
    ],
    howJudgesRate: "How judges rate:",
    judgeRateDetails: [
      "Dressing (1-10 points)",
      "Performance (1-10 points)",
      "Q&A (1-10 points)"
    ],
    judgeMaxScore: "Maximum score per judge: 30 points (10 + 10 + 10)",
    judgeSummed: "All judges' ratings are summed together to get the total rating",
    judgeExample: "Example: 5 judges each giving 30 points = 150 total rating",
    calcDesc: "The final score combines student votes and judge ratings using a normalized, weighted system to ensure fair comparison.",
    normDetail: "Both votes and ratings are normalized to a 0-100 scale based on the highest values in the group:",
    normVotes: "Normalized Votes = (Candidate Votes ÷ Highest Votes) × 100",
    normRatings: "Normalized Ratings = (Candidate Ratings ÷ Highest Ratings) × 100",
    normNote: "This ensures fair comparison regardless of absolute numbers.",
    weightDetail: "The final combined score uses a weighted average:",
    weightFormula: "Combined Score = (Normalized Votes × 60%) + (Normalized Ratings × 40%)",
    weightNote: "Weighting: Student votes contribute 60% and judge ratings contribute 40% to the final score.",
    exampleCandidates: "Suppose we have 3 candidates:",
    exampleA: "Candidate A: 100 votes, 300 ratings",
    exampleB: "Candidate B: 50 votes, 150 ratings",
    exampleC: "Candidate C: 25 votes, 90 ratings",
    exampleNorm: "Normalization:",
    exampleResultA: "Candidate A: 100% votes, 100% ratings → Score: 100",
    exampleResultB: "Candidate B: 50% votes, 50% ratings → Score: 50",
    exampleResultC: "Candidate C: 25% votes, 30% ratings → Score: 27 (25×0.6 + 30×0.4)",
    steps: [
      {
        title: "First Round",
        content: "All candidates are eligible. Voters can choose one male and one female candidate."
      },
      {
        title: "Selection",
        content: "Top candidates are selected based on first round votes to advance to the second round."
      },
      {
        title: "Second Round",
        content: "Judges rate candidates on a 1-10 scale for Dressing, Performance, and Q&A. Each judge can give up to 30 points total (10 per category)."
      },
      {
        title: "Score Calculation",
        content: "Final scores combine student votes (60%) and judge ratings (40%). Both are normalized to ensure fair comparison across all candidates."
      },
      {
        title: "In Case of Tie",
        content: "Judges will choose one candidate."
      },
      {
        title: "Final Results",
        content: "Winners are determined by the highest combined score and announced on stage!"
      }
    ]
  },
  my: {
    title: "မဲပေးခြင်းဆိုင်ရာ မူဝါဒ",
    subtitle: "ရွေးချယ်မှု လုပ်ငန်းစဉ် မည်သို့လုပ်ဆောင်သည်ကို လေ့လာပါ",
    selectionProcess: "ရွေးချယ်မှု လုပ်ငန်းစဉ်",
    howScoresCalculated: "ရလဒ်တွက်ချက်ပုံ",
    studentVotes: "ကျောင်းသားများ၏ မဲပေးမှု",
    judgeRatings: "ဒိုင်လူကြီးများ၏ အမှတ်ပေးမှု",
    finalScoreCalc: "နောက်ဆုံး ပေါင်းစပ်ရမှတ် တွက်ချက်ခြင်း",
    normalization: "အဆင့် ၁ - စံနှုန်းညှိယူခြင်း (Normalization)",
    weightedCombination: "အဆင့် ၂ - အချိုးကျ ပေါင်းစပ်ခြင်း (Weighted Combination)",
    exampleCalculation: "တွက်ချက်မှု နမူနာ",
    transparency: "ပွင့်လင်းမြင်သာမှုနှင့် တရားမျှတမှု",
    transparencyDesc: "ဤရမှတ်စနစ်သည် အောက်ပါအချက်များကို အာမခံသည် -",
    transparencyList: [
      "ကိုယ်စားလှယ်လောင်းအားလုံးကို Normalization အသုံးပြု၍ တူညီသောစံနှုန်းဖြင့် အကဲဖြတ်သည်",
      "ကျောင်းသားမဲများနှင့် ဒိုင်လူကြီးများ၏ အကဲဖြတ်မှုကို နောက်ဆုံးရလဒ်တွင် ထည့်သွင်းစဉ်းစားသည်",
      "အချိုးအစား (မဲ ၆၀%၊ ဒိုင် ၄၀%) သည် လူကြိုက်များမှုနှင့် ကျွမ်းကျင်မှုတို့ကို မျှတစေသည်",
      "မဲ သို့မဟုတ် အမှတ်ပေးသူ နည်းပါးခြင်းကြောင့် ကိုယ်စားလှယ်လောင်းများ နစ်နာမှုမရှိစေရ"
    ],
    contactInfo: "အသေးစိတ်သိရှိလိုပါက ပွဲစီစဉ်သူများကို ဆက်သွယ်မေးမြန်းနိုင်ပါသည်။",
    previous: "ရှေ့သို့",
    next: "နောက်သို့",
    howToVote: "မဲပေးနည်း -",
    studentVoteDetails: [
      "ကျောင်းသားတစ်ဦးလျှင် အမျိုးသား (၁) ဦးနှင့် အမျိုးသမီး (၁) ဦးစီကို မဲပေးနိုင်သည်",
      "မဲတစ်မဲစီသည် ကိုယ်စားလှယ်လောင်း၏ မဲအရေအတွက်ကို ၁ တိုးစေသည်",
      "မဲများကို အရေအတွက်အတိုင်း တိုက်ရိုက်ရေတွက်သည် (ဥပမာ - မဲ ၁၀၀ = စုစုပေါင်းမဲ ၁၀၀)",
      "လျှို့ဝှက်ကုဒ်များကို ကျား/မ ကဏ္ဍတစ်ခုစီအတွက် တစ်ကြိမ်သာ အသုံးပြုနိုင်သည်"
    ],
    howJudgesRate: "ဒိုင်အမှတ်ပေးနည်း -",
    judgeRateDetails: [
      "ဝတ်စားဆင်ယင်မှု (၁-၁၀ မှတ်)",
      "တင်ဆက်မှု (၁-၁၀ မှတ်)",
      "မေးခွန်းဖြေဆိုမှု (၁-၁၀ မှတ်)"
    ],
    judgeMaxScore: "ဒိုင်တစ်ဦးလျှင် အများဆုံးပေးနိုင်သည့်အမှတ် - ၃၀ မှတ် (၁၀ + ၁၀ + ၁၀)",
    judgeSummed: "ဒိုင်အားလုံး၏ အမှတ်များကို ပေါင်း၍ စုစုပေါင်းအမှတ်ကို ရယူသည်",
    judgeExample: "ဥပမာ - ဒိုင် ၅ ဦးစီမှ ၃၀ မှတ်စီပေးပါက စုစုပေါင်းအမှတ် ၁၅၀ ဖြစ်သည်",
    calcDesc: "နောက်ဆုံးရမှတ်ကို ကျောင်းသားမဲနှင့် ဒိုင်အမှတ်များအား စံနှုန်းညှိ (Normalization) ပြီး အချိုးကျပေါင်းစပ် တွက်ချက်ပါသည်။",
    normDetail: "မဲနှင့် အမှတ်များကို အမြင့်ဆုံးရရှိသူ၏ တန်ဖိုးပေါ်အခြေခံ၍ ၀ မှ ၁၀၀ စံနှုန်းအတွင်း ညှိယူပါသည် -",
    normVotes: "ညှိယူထားသောမဲ = (ကိုယ်စားလှယ်လောင်းမဲ ÷ အမြင့်ဆုံးမဲ) × ၁၀၀",
    normRatings: "ညှိယူထားသော အမှတ် = (ကိုယ်စားလှယ်လောင်းအမှတ် ÷ အမြင့်ဆုံးအမှတ်) × ၁၀၀",
    normNote: "၎င်းသည် ပကတိအရေအတွက် ကွာခြားသော်လည်း မျှတသော နှိုင်းယှဉ်မှုကို ရရှိစေသည်။",
    weightDetail: "နောက်ဆုံး ပေါင်းစပ်ရမှတ်အတွက် ပျမ်းမျှအချိုးကို အသုံးပြုပါသည် -",
    weightFormula: "ပေါင်းစပ်ရမှတ် = (ညှိယူထားသောမဲ × ၆၀%) + (ညှိယူထားသော အမှတ် × ၄၀%)",
    weightNote: "အချိုးအစား - ကျောင်းသားမဲသည် ၆၀% နှင့် ဒိုင်လူကြီးအမှတ်သည် ၄၀% ပါဝင်သည်။",
    exampleCandidates: "ကိုယ်စားလှယ်လောင်း ၃ ဦး ရှိသည်ဆိုပါစို့ -",
    exampleA: "ကိုယ်စားလှယ်လောင်း က - မဲ ၁၀၀၊ အမှတ် ၃၀၀",
    exampleB: "ကိုယ်စားလှယ်လောင်း ခ - မဲ ၅၀၊ အမှတ် ၁၅၀",
    exampleC: "ကိုယ်စားလှယ်လောင်း ဂ - မဲ ၂၅၊ အမှတ် ၉၀",
    exampleNorm: "စံနှုန်းညှိခြင်း -",
    exampleResultA: "ကိုယ်စားလှယ်လောင်း က - မဲ ၁၀၀%၊ အမှတ် ၁၀၀% → ရမှတ် - ၁၀၀",
    exampleResultB: "ကိုယ်စားလှယ်လောင်း ခ - မဲ ၅၀%၊ အမှတ် ၅၀% → ရမှတ် - ၅၀",
    exampleResultC: "ကိုယ်စားလှယ်လောင်း ဂ - မဲ ၂၅%၊ အမှတ် ၃၀% → ရမှတ် - ၂၇ (၂၅×၀.၆ + ၃၀×၀.၄)",
    steps: [
      {
        title: "ပထမအဆင့်",
        content: "ကိုယ်စားလှယ်လောင်း အားလုံး ပါဝင်ယှဉ်ပြိုင်ခွင့်ရှိသည်။ မဲပေးသူများသည် အမျိုးသား (၁) ဦးနှင့် အမျိုးသမီး (၁) ဦးစီကို ရွေးချယ်နိုင်ပါသည်။"
      },
      {
        title: "ရွေးချယ်ခြင်း",
        content: "ပထမအဆင့်မှ မဲအများဆုံးရရှိသော ကိုယ်စားလှယ်လောင်းများကို ဒုတိယအဆင့်သို့ တက်ရောက်ရန် ရွေးချယ်မည်ဖြစ်သည်။"
      },
      {
        title: "ဒုတိယအဆင့်",
        content: "ဒိုင်လူကြီးများသည် ဝတ်စားဆင်ယင်မှု၊ တင်ဆက်မှုနှင့် မေးခွန်းဖြေဆိုမှုတို့အတွက် ၁ မှ ၁၀ အထိ အမှတ်ပေးမည်ဖြစ်သည်။ ဒိုင်တစ်ဦးလျှင် စုစုပေါင်း အမှတ် ၃၀ အထိ ပေးနိုင်ပါသည်။"
      },
      {
        title: "ရမှတ်တွက်ချက်ခြင်း",
        content: "နောက်ဆုံးရမှတ်များကို ကျောင်းသားမဲ (၆၀%) နှင့် ဒိုင်လူကြီးအမှတ် (၄၀%) ပေါင်းစပ်၍ တွက်ချက်မည်ဖြစ်သည်။ အားလုံးကို တူညီသောစံနှုန်းဖြင့် မျှတစွာ နှိုင်းယှဉ်နိုင်ရန် ညှိယူတွက်ချက်ပါသည်။"
      },
      {
        title: "ရမှတ်တူနေပါက",
        content: "ဒိုင်လူကြီးများမှ ကိုယ်စားလှယ်လောင်း တစ်ဦးကို ရွေးချယ်ပေးမည် ဖြစ်သည်။"
      },
      {
        title: "နောက်ဆုံးရလဒ်များ",
        content: "ပေါင်းစပ်ရမှတ် အများဆုံးရသူများကို အောင်နိုင်သူအဖြစ် သတ်မှတ်ပြီး စင်မြင့်ပေါ်တွင် ကြေညာမည်ဖြစ်သည်။"
      }
    ]
  }
};

const policyStepIcons = [
  <Users key="0" className="w-8 h-8" />,
  <UserCheck key="1" className="w-8 h-8" />,
  <Award key="2" className="w-8 h-8" />,
  <Calculator key="3" className="w-8 h-8" />,
  <EqualApproximately key="4" className="w-8 h-8" />,
  <Crown key="5" className="w-8 h-8" />
];

export default function PolicyPage() {
    const [currentStep, setCurrentStep] = useState(0)
    const [lang, setLang] = useState<'en' | 'my'>('en')
    
    const t = translations[lang];
  
    const nextStep = () => setCurrentStep((prev) => (prev + 1) % t.steps.length)
    const prevStep = () => setCurrentStep((prev) => (prev - 1 + t.steps.length) % t.steps.length)
  
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : process.env.NEXT_PUBLIC_BASE_URL || "https://puselection.vercel.app";

  // Structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: lang === 'en' ? "Voting Policy - PU Selection" : "မဲပေးခြင်းဆိုင်ရာ မူဝါဒ - PU Selection",
    description: lang === 'en' ? "Understand how the PU Selection voting process works" : "PU Selection ၏ မဲပေးခြင်းဆိုင်ရာ မူဝါဒများကို လေ့လာပါ",
    url: `${baseUrl}/policy`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-5xl mx-auto p-4 md:p-6 py-8">
        {/* Language Switcher */}
        <div className="flex justify-end mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLang(lang === 'en' ? 'my' : 'en')}
            className="flex items-center gap-2 border-2 border-candidate-male-200 hover:bg-candidate-male-50"
          >
            <Languages className="w-4 h-4" />
            <span>{lang === 'en' ? 'မြန်မာဘာသာ' : 'English'}</span>
          </Button>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <ScrollText className="w-6 h-6 md:w-8 md:h-8 text-candidate-male-600" />
            <h1 className={`text-3xl md:text-5xl font-bold bg-gradient-to-r from-candidate-male-600 via-candidate-female-600 to-candidate-male-600 bg-clip-text text-transparent ${lang === 'my' ? 'leading-tight' : ''}`}>
              {t.title}
            </h1>
            <Crown className="w-6 h-6 md:w-8 md:h-8 text-candidate-female-600" />
          </div>
          <p className="text-sm md:text-base text-gray-600 mt-2">
            {t.subtitle}
          </p>
        </motion.div>
  
        {/* Policy Steps Carousel */}
        <Card className="mb-6 rounded-2xl shadow-xl border-2 border-gray-200/50 bg-gradient-to-br from-white to-gray-50/30 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-candidate-male-600 via-candidate-female-500 to-candidate-male-600 pb-4">
            <CardTitle className="flex items-center justify-center gap-3 text-xl md:text-2xl font-bold text-white">
              <Sparkles className="w-5 h-5 md:w-6 md:h-6 animate-pulse" />
              <span>{t.selectionProcess}</span>
              <Sparkles className="w-5 h-5 md:w-6 md:h-6 animate-pulse" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <div className="relative h-96 mb-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep + lang}
                  initial={{ opacity: 0, x: 50, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -50, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center"
                >
                  <motion.div
                    className={`p-6 md:p-8 rounded-2xl mb-6 shadow-xl ${
                      currentStep === 0
                        ? "bg-gradient-to-br from-blue-100 to-blue-200"
                        : currentStep === 1
                        ? "bg-gradient-to-br from-green-100 to-green-200"
                        : currentStep === 2
                        ? "bg-gradient-to-br from-candidate-male-100 to-candidate-male-200"
                        : currentStep === 3
                        ? "bg-gradient-to-br from-candidate-female-100 to-candidate-female-200"
                        : currentStep === 4
                        ? "bg-gradient-to-br from-pink-100 to-pink-200"
                        : "bg-gradient-to-br from-amber-100 to-amber-200"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="text-candidate-male-700">
                      {policyStepIcons[currentStep]}
                    </div>
                  </motion.div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-candidate-male-600 to-candidate-female-600 bg-clip-text text-transparent">
                    {t.steps[currentStep].title}
                  </h2>
                  <p className="text-base md:text-lg text-gray-700 max-w-2xl leading-relaxed">
                    {t.steps[currentStep].content}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
  
            {/* Navigation */}
            <div className="flex justify-between items-center mb-6">
              <Button
                onClick={prevStep}
                variant="outline"
                className="flex items-center gap-2 border-2 hover:bg-candidate-male-50 hover:border-candidate-male-300"
              >
                <ChevronLeft className="w-4 h-4" /> {t.previous}
              </Button>
              <div className="flex space-x-2">
                {t.steps.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentStep
                        ? 'bg-gradient-to-r from-candidate-male-600 to-candidate-female-600'
                        : 'bg-gray-300'
                    }`}
                    animate={{
                      scale: index === currentStep ? 1.3 : 1,
                    }}
                    whileHover={{ scale: 1.2 }}
                  />
                ))}
              </div>
              <Button
                onClick={nextStep}
                variant="outline"
                className="flex items-center gap-2 border-2 hover:bg-candidate-male-50 hover:border-candidate-male-300"
              >
                {t.next} <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
  
        {/* Score Calculation Documentation */}
        <Card className="mb-6 rounded-2xl shadow-xl border-2 border-gray-200/50 bg-gradient-to-br from-white to-gray-50/30 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-candidate-male-600 via-candidate-female-500 to-candidate-male-600 pb-4">
            <CardTitle className="flex items-center justify-center gap-3 text-xl md:text-2xl font-bold text-white">
              <Info className="w-5 h-5 md:w-6 md:h-6" />
              <span>{t.howScoresCalculated}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <div className="space-y-8">
              {/* How Votes Are Cast */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-bold text-blue-900">{t.studentVotes}</h3>
                </div>
                <div className="space-y-3 text-gray-700">
                  <p className="leading-relaxed">
                    <strong className="text-blue-900">{t.howToVote}</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-2">
                    {t.studentVoteDetails.map((detail, i) => (
                      <li key={i}>{detail}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              {/* How Ratings Are Cast */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Award className="w-6 h-6 text-purple-600" />
                  <h3 className="text-xl font-bold text-purple-900">{t.judgeRatings}</h3>
                </div>
                <div className="space-y-3 text-gray-700">
                  <p className="leading-relaxed">
                    <strong className="text-purple-900">{t.howJudgesRate}</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-2">
                    <li>{lang === 'en' ? 'Each judge rates candidates on a 1-10 scale for:' : 'ဒိုင်လူကြီးတစ်ဦးစီသည် ၁ မှ ၁၀ စကေးဖြင့် အောက်ပါကဏ္ဍများကို အမှတ်ပေးသည် -'}
                      <ul className="list-circle list-inside ml-4 mt-1 space-y-1">
                        {t.judgeRateDetails.map((detail, i) => (
                          <li key={i}><strong>{detail}</strong></li>
                        ))}
                      </ul>
                    </li>
                    <li>{t.judgeMaxScore}</li>
                    <li>{t.judgeSummed}</li>
                    <li>{t.judgeExample}</li>
                  </ul>
                </div>
              </motion.div>

              {/* Score Calculation Process */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-candidate-male-50 to-candidate-female-50 rounded-xl p-6 border-2 border-candidate-male-200"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Calculator className="w-6 h-6 text-candidate-male-600" />
                  <h3 className="text-xl font-bold bg-gradient-to-r from-candidate-male-600 to-candidate-female-600 bg-clip-text text-transparent">
                    {t.finalScoreCalc}
                  </h3>
                </div>
                <div className="space-y-4 text-gray-700">
                  <p className="leading-relaxed">
                    {t.calcDesc}
                  </p>
                  
                  <div className="bg-white rounded-lg p-4 border-2 border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Scale className="w-5 h-5 text-candidate-male-600" />
                      {t.normalization}
                    </h4>
                    <p className="text-sm mb-2">{t.normDetail}</p>
                    <ul className="list-disc list-inside space-y-1 text-sm ml-2">
                      <li><strong>{t.normVotes}</strong></li>
                      <li><strong>{t.normRatings}</strong></li>
                    </ul>
                    <p className="text-xs mt-2 text-gray-600 italic">
                      {t.normNote}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-4 border-2 border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-candidate-female-600" />
                      {t.weightedCombination}
                    </h4>
                    <p className="text-sm mb-2">{t.weightDetail}</p>
                    <div className="bg-gradient-to-r from-candidate-male-100 to-candidate-female-100 rounded-lg p-3 mt-2">
                      <p className="text-center font-mono text-lg font-bold">
                        {t.weightFormula}
                      </p>
                    </div>
                    <p className="text-xs mt-2 text-gray-600">
                      <strong>{t.weightNote}</strong>
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-4 border-2 border-gray-200 mt-4">
                    <h4 className="font-bold text-gray-900 mb-2 text-sm">{t.exampleCalculation}</h4>
                    <div className="text-sm space-y-2">
                      <p>{t.exampleCandidates}</p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li><strong>{t.exampleA}</strong></li>
                        <li><strong>{t.exampleB}</strong></li>
                        <li><strong>{t.exampleC}</strong></li>
                      </ul>
                      <p className="mt-2"><strong>{t.exampleNorm}</strong></p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>{t.exampleResultA}</li>
                        <li>{t.exampleResultB}</li>
                        <li>{t.exampleResultC}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Transparency Note */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-green-50 rounded-xl p-6 border-2 border-green-200"
              >
                <div className="flex items-start gap-3">
                  <Info className="w-6 h-6 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-bold text-green-900 mb-2">{t.transparency}</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {t.transparencyDesc}
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 mt-2 ml-2">
                      {t.transparencyList.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          </CardContent>
        </Card>
  
        {/* Footer */}
        <div className="text-center">
          <Card className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200/50 rounded-xl">
            <CardContent className="p-4 md:p-6">
              <p className="text-sm md:text-base text-gray-600">
                {t.contactInfo}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
    )
  }
