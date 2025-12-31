<template>
  <div class="p-4 gap-4 flex flex-col">
    <div class="bg-gray-50 rounded-lg p-6 border border-gray-200">
      <a 
        href="https://docs.google.com/spreadsheets/d/1QXqLY2BOXj6wccFSNnlUaXKXqK5KZudWUottoBC7RxY/edit?gid=0#gid=0" 
        target="_blank"
        class="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium underline"
      >
        List Procedures (UNIF)
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </div>
    <div class="bg-gray-50 rounded-lg p-6 border border-gray-200">
      <a 
        href="https://docs.google.com/spreadsheets/d/1rhmW3iwXSXAJrSvgqlYgHiIBWZhxvISY/edit?gid=555428880#gid=555428880" 
        target="_blank"
        class="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium underline mb-6"
      >
        Status Code Flow
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>

      <div class="overflow-hidden border border-gray-200 rounded-lg">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-100">
            <tr>
              <th scope="col" class="px-6 py-3 w-[140px] text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status Code</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status Name</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200 text-sm">
            <tr>
              <td class="px-6 py-3 font-mono text-indigo-600 font-medium">001</td>
              <td class="px-6 py-3 text-gray-900">
                <div>送信待ち</div>
                <div class="text-xs text-gray-500 mt-0.5">Chờ gửi</div>
              </td>
            </tr>
            <tr>
              <td class="px-6 py-3 font-mono text-indigo-600 font-medium">002</td>
              <td class="px-6 py-3 text-gray-900">
                <div>処理中</div>
                <div class="text-xs text-gray-500 mt-0.5">Đang xử lý</div>
              </td>
            </tr>
            <tr>
              <td class="px-6 py-3 font-mono text-indigo-600 font-medium">003</td>
              <td class="px-6 py-3 text-gray-900">
                <div>終了</div>
                <div class="text-xs text-gray-500 mt-0.5">Hoàn thành</div>
              </td>
            </tr>
            <tr>
              <td class="px-6 py-3 font-mono text-indigo-600 font-medium">004</td>
              <td class="px-6 py-3 text-gray-900">
                <div>要再申請</div>
                <div class="text-xs text-gray-500 mt-0.5">Cần nộp lại - submit correct</div>
              </td>
            </tr>
            <tr>
              <td class="px-6 py-3 font-mono text-indigo-600 font-medium">005</td>
              <td class="px-6 py-3 text-gray-900">
                <div>要ダウンロード</div>
                <div class="text-xs text-gray-500 mt-0.5">Yêu cầu tải xuống</div>
              </td>
            </tr>
            <tr>
              <td class="px-6 py-3 font-mono text-indigo-600 font-medium">007</td>
              <td class="px-6 py-3 text-gray-900">
                <div>納付待ち</div>
                <div class="text-xs text-gray-500 mt-0.5">Chờ thanh toán</div>
              </td>
            </tr>
            <tr>
              <td class="px-6 py-3 font-mono text-indigo-600 font-medium">008</td>
              <td class="px-6 py-3 text-gray-900">
                <div>要再申請</div>
                <div class="text-xs text-gray-500 mt-0.5">Cần nộp lại - resubmit</div>
              </td>
            </tr>
            <tr>
              <td class="px-6 py-3 font-mono text-indigo-600 font-medium">010</td>
              <td class="px-6 py-3 text-gray-900">
                <div>取下げ済み</div>
                <div class="text-xs text-gray-500 mt-0.5">Đã hủy</div>
              </td>
            </tr>
            <tr>
              <td class="px-6 py-3 font-mono text-indigo-600 font-medium">013</td>
              <td class="px-6 py-3 text-gray-900">
                <div>取下げ処理中</div>
                <div class="text-xs text-gray-500 mt-0.5">Đang xử lý hủy</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
// Status Code Flow component
</script>
