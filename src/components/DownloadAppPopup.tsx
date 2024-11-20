import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Check, LinkIcon } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

type Props = {
  onOpenChange(open: boolean): void;
  appLink: string;
};

export function DownloadAppPopup({ onOpenChange, appLink }: Props) {
  const { toast } = useToast();

  async function copyLink() {
    await navigator.clipboard.writeText(appLink);
    toast({
      title: "Đã copy link!",
      action: <Check className="h-5 w-5 text-green-500" />,
    });
  }

  return (
    <Dialog open={!!appLink} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby="">
        <DialogHeader>
          <DialogTitle>Tải ứng dụng</DialogTitle>
          <DialogDescription>
            Hãy quét mã hoặc nhấn copy link bên dưới để tải ứng dụng
          </DialogDescription>
        </DialogHeader>
        <div className="my-6 mx-auto ">
          <QRCodeSVG size={256} value={appLink} />
          <Button onClick={copyLink} className="mt-4 w-full">
            <LinkIcon className="size-5 mr-2" /> Copy link
          </Button>
        </div>
        <DialogFooter>
          <DialogClose>Đóng</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
