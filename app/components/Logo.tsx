import { useRouter } from 'next/navigation';

export function Logo() {
    const router = useRouter();

    return (
        <div
            className="p-4 border-b border-gray-800 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => router.push('/')}
        >
            <div className="flex items-center gap-2">
                <div className="text-blue-500 font-bold text-2xl">JX</div>
                <div className="text-gray-100 font-bold text-2xl">GPT</div>
            </div>
        </div>
    );
}