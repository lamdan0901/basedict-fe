import Link from "next/link";

export default function PolicyPage() {
  return (
    <div className="w-full mt-4 max-w-4xl border border-muted-foreground rounded-2xl mx-auto sm:pt-10 pt-3 sm:px-12 px-4 pb-4">
      <h2 className="text-3xl mx-auto  w-fit block font-bold">
        Chính sách bảo mật
      </h2>
      <br />
      <br />
      Chúng tôi, BaseDict, cam kết bảo vệ quyền riêng tư của bạn. Chính sách Bảo
      mật này giải thích cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ
      thông tin cá nhân của bạn khi sử dụng trang web từ điển của chúng tôi.
      <br />
      <br />
      <b> 1. Thông tin chúng tôi thu thập</b>
      <br />
      Khi bạn đăng ký tài khoản trên trang web của chúng tôi, chúng tôi chỉ thu
      thập duy nhất thông tin cá nhân là tên của bạn. Chúng tôi không thu thập
      bất kỳ thông tin nào khác như email, số điện thoại, địa chỉ hay các thông
      tin cá nhân khác.
      <br />
      <br />
      <b>2. Mục đích sử dụng thông tin</b>
      <br />
      Thông tin tên của bạn được sử dụng để cá nhân hóa trải nghiệm của bạn trên
      trang web, bao gồm việc hiển thị tên của bạn khi bạn đăng nhập. Chúng tôi
      không sử dụng thông tin này cho bất kỳ mục đích nào khác ngoài việc nâng
      cao trải nghiệm người dùng.
      <br />
      <br />
      <b>3. Chia sẻ thông tin</b>
      <br />
      Chúng tôi không chia sẻ thông tin cá nhân của bạn với bất kỳ bên thứ ba
      nào. Thông tin của bạn được bảo mật và chỉ được sử dụng trong nội bộ trang
      web của chúng tôi.
      <br />
      <br />
      <b>4. Bảo mật thông tin</b>
      <br />
      Chúng tôi thực hiện các biện pháp bảo mật phù hợp để bảo vệ thông tin cá
      nhân của bạn khỏi truy cập, sử dụng hoặc tiết lộ trái phép. Tuy nhiên, xin
      lưu ý rằng không có phương thức truyền tải nào qua Internet hoặc phương
      thức lưu trữ điện tử nào là hoàn toàn an toàn.
      <br />
      <br />
      <b>5. Quyền của bạn</b>
      <br />
      Bạn có quyền xem xét, cập nhật hoặc xóa thông tin cá nhân của mình bất kỳ
      lúc nào bằng cách truy cập vào tài khoản của bạn trên trang web.
      <br />
      <br />
      <b>6. Thay đổi chính sách</b>
      <br />
      Chúng tôi có thể cập nhật Chính sách Bảo mật này theo thời gian. Mọi thay
      đổi sẽ được thông báo rõ ràng trên trang web của chúng tôi. Việc tiếp tục
      sử dụng trang web sau khi có thay đổi đồng nghĩa với việc bạn đồng ý với
      các thay đổi đó.
      <br />
      <br />
      <b> 7. Liên hệ</b>
      <br />
      Nếu bạn có bất kỳ câu hỏi nào về Chính sách Bảo mật này, vui lòng liên hệ
      với chúng tôi qua basedict.work@gmail.com hoặc{" "}
      <Link
        className="hover:underline text-blue-500"
        href={
          "https://docs.google.com/forms/d/1MtO5RCWdGR7SX3qTSjyeKVBX_tocLc2k6s3BVr0ZlUo"
        }
        target="_blank"
      >
        hòm thư góp ý
      </Link>
      <br />
      <div className="ml-auto mt-10 w-fit">
        <div>
          <b>BaseDict</b>
        </div>
        <div>26/8/2024</div>
      </div>
    </div>
  );
}
