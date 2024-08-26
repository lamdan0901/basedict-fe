import Link from "next/link";

export default function AboutUsPage() {
  return (
    <div className="w-full mt-4 max-w-4xl border border-muted-foreground rounded-2xl mx-auto sm:pt-10 pt-3 sm:px-12 px-4 pb-4">
      <h2 className="text-3xl mx-auto  w-fit block font-bold">Về chúng tôi</h2>
      <br />
      <br />
      Chào mừng bạn đến vớ BaseDict
      <br />
      <br />
      Chúng tôi là một nhóm đam mê ngôn ngữ và công nghệ, với sứ mệnh mang đến
      cho người dùng trải nghiệm dịch từ điển chất lượng cao và toàn diện. Tại
      Basedict, chúng tôi cung cấp các công cụ mạnh mẽ để bạn có thể dễ dàng tra
      cứu từ vựng, dịch văn bản, và nâng cao kỹ năng ngôn ngữ của mình.
      <br />
      <br />
      <b> Sứ mệnh của chúng tôi</b>
      <br />
      Sứ mệnh của chúng tôi là cung cấp dịch vụ dịch từ điển với dữ liệu dịch
      nghĩa chi tiết và chính xác nhất, giúp người dùng hiểu sâu hơn về từng từ
      ngữ và ngữ cảnh sử dụng. Bên cạnh đó, chúng tôi cũng cung cấp tính năng
      dịch văn bản với tốc độ phản hồi nhanh, giúp bạn tiết kiệm thời gian mà
      vẫn đảm bảo chất lượng dịch thuật.
      <br />
      <br />
      <b> Các tính năng nổi bật</b>
      <br />
      <div className="font-bold">- Dịch từ điển chất lượng cao:</div>
      <div>
        Chúng tôi cung cấp những định nghĩa chi tiết và giải nghĩa chuyên sâu
        cho từ ngữ, giúp bạn nắm bắt được ý nghĩa một cách chính xác và toàn
        diện.
      </div>
      <div className="font-bold">- Dịch văn bản nhanh chóng:</div>
      <div>
        Với công nghệ tiên tiến, trang web của chúng tôi cho phép bạn dịch văn
        bản với tốc độ nhanh mà không làm giảm chất lượng của bản dịch.
      </div>
      <div className="font-bold">- Luyện đọc và luyện thi JLPT:</div>
      <div>
        Đối với những người học tiếng Nhật, chúng tôi cung cấp các bài luyện đọc
        và luyện thi JLPT (Japanese Language Proficiency Test) giúp bạn chuẩn bị
        tốt nhất cho kỳ thi với các bài tập thực tế và các mẹo học tập hiệu quả.
      </div>
      <br />
      <b> Giá trị cốt lõi</b>
      <br />
      <div className="font-bold">- Độ tin cậy:</div>
      <div>
        Chúng tôi cam kết cung cấp những dịch vụ đáng tin cậy và chính xác nhất,
        giúp bạn yên tâm khi sử dụng trang web của chúng tôi.
      </div>
      <div className="font-bold">- Trải nghiệm người dùng:</div>
      <div>
        Giao diện đơn giản, trực quan, được thiết kế để mang lại trải nghiệm sử
        dụng mượt mà và tiện lợi cho người dùng.
      </div>
      <div className="font-bold">- Phản hồi nhanh chóng:</div>
      <div>
        Chúng tôi hiểu rằng thời gian là quý báu, vì vậy luôn nỗ lực tối ưu hóa
        tốc độ xử lý để cung cấp cho bạn các kết quả nhanh nhất.
      </div>
      <br />
      <b> Liên hệ với chúng tôi</b>
      <br />
      Chúng tôi luôn sẵn sàng lắng nghe phản hồi từ bạn để tiếp tục phát triển
      và cải thiện dịch vụ. Nếu bạn có bất kỳ câu hỏi, góp ý hay cần hỗ trợ,
      đừng ngần ngại liên hệ với chúng tôi qua email basedict.work@gmail.com
      hoặc{" "}
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
