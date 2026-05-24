import { LegalDocument } from "@/components/legal/legal-document";

export default function TermsPage() {
  return (
    <LegalDocument title="شروط الخدمة" lastUpdated="23 مايو 2026">
      <p>باستخدام GTRmusic فإنك توافق على هذه الشروط. المحتوى للاستماع الشخصي غير التجاري ما لم يُذكر خلاف ذلك.</p>
      <p>يحظر رفع محتوى مخالف للقانون أو منتهك لحقوق الغير. نحتفظ بحق إيقاف الحسابات المخالفة.</p>
      <p>الربح للمبدعين يخضع لشروط البرنامج: 100,000 تشغيل و10,000 متابع كحد أدنى.</p>
    </LegalDocument>
  );
}
