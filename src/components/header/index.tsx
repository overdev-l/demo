import { Button } from '@/components/ui/button';
import { Image, Frame, Type, LocateFixed } from 'lucide-react';
import { useRenderStore, useUiStateStore } from '@/store';
import { cn } from '@/lib/utils';
import { CoreMouseMode, createImage } from '@/render';
import file2base64 from '@/utils/file2base64';

export default function Header() {
  const { render, renderSelection, historyPlugins } = useRenderStore();
  const { isCreateFrame, isCreateText, setIsCreateFrame, setIsCreateText } =
    useUiStateStore();
  const setCreateFrame = () => {
    if (isCreateText) {
      renderSelection?.setMode(CoreMouseMode.SELECTION);
      setIsCreateText(false);
      return;
    }
    if (isCreateFrame) {
      renderSelection?.setMode(CoreMouseMode.SELECTION);
      setIsCreateFrame(false);
      return;
    }
    renderSelection?.setMode(CoreMouseMode.FRAME);
    setIsCreateFrame(true);
  };
  const setCreateText = () => {
    if (isCreateFrame) {
      renderSelection?.setMode(CoreMouseMode.SELECTION);
      setIsCreateFrame(false);
      return;
    }
    if (isCreateText) {
      renderSelection?.setMode(CoreMouseMode.SELECTION);
      setIsCreateText(false);
      return;
    }
    renderSelection?.setMode(CoreMouseMode.TEXT);
    setIsCreateText(true);
  };
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && render?._FC) {
      const base64 = await file2base64(file);
      const el = await createImage(render?._FC, {
        src: base64,
      });
      render?.add(el);
      render?._FC.centerObject(el);
      render?._FC.setActiveObject(el);
    }
  };
  const backToOrigin = () => {
    render?.backToOriginPosition();
  };

  const undo = () => {
    historyPlugins?.undo();
  };

  const redo = () => {
    historyPlugins?.redo();
  };
  const setCurrentLoading = () => {
    const id = render?._FC.getActiveObject()?._id_;
    if (id) {
      render?.setLoading(id);
    }
  }
  const setCurrentLoaded = () => {
    const id = render?._FC.getActiveObject()?._id_;
    if (id) {
      render?.setLoaded(id);
    }
  }

  return (
    <header className="border-b">
      <div className="flex h-14 items-center px-4 gap-4">
        <div className="flex items-center gap-1 border-x px-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={setCreateFrame}
            className={cn(isCreateFrame && 'bg-gray-200')}
          >
            <Frame className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="relative">
            <Image className="h-5 w-5" />
            <input
              type="file"
              className="opacity-0 absolute w-full h-full cursor-pointer"
              onChange={handleImageChange}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={setCreateText}
            className={cn(isCreateText && 'bg-gray-200')}
          >
            <Type className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={backToOrigin}>
            <LocateFixed className="h-5 w-5" />
          </Button>
          <Button variant="ghost" className='w-fit' size="icon" onClick={setCurrentLoading}>
            loading
          </Button>
          <Button variant="ghost" className='w-fit' size="icon" onClick={setCurrentLoaded}>
            loaded
          </Button>
        </div>
        <div className="flex-1" />
      </div>
    </header>
  );
}
