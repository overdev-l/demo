import { Canvas, FabricObject } from '@/render'
export default function ContextMenu({ target, canvas, destroy }: { target: FabricObject, canvas: Canvas, destroy: () => void }) {
  return (
    <div className='context-menu w-20 h-fit bg-white rounded-md shadow-md p-2'>
      <div className='flex flex-col gap-2'>
        <button className='w-full h-8 bg-gray-100 rounded-md' onClick={() => {
            target.clone().then(clone => {
                canvas.add(clone);
                destroy();
            })
        }}>复制</button>
        <button className='w-full h-8 bg-gray-100 rounded-md' onClick={() => {
            canvas.remove(target);
            destroy();
        }}>删除</button>
      </div>
    </div>
  )
}
