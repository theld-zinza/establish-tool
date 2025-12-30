<template>
  <div class="p-6 text-gray-800 space-y-6">
    <!-- Section 1 -->
    <section>
      <h3 class="text-lg font-bold text-gray-900 mb-3 border-b pb-1">1. Cách pass qua step ký</h3>
      
      <div class="ml-4 space-y-4">
        <div>
          <h4 class="font-semibold text-lg text-indigo-700 mb-2">Case establish</h4>
          <p class="mt-2 font-mono text-sm bg-gray-50 p-3 rounded border border-gray-200">
            establish_status = 2<br>
            temp_reference_number = null<br>
            reference_number = null<br>
            temp_reference_number_done_establish != null<br>
            reference_number_done_establish != null
          </p>
        </div>

        <div>
          <h4 class="font-semibold text-lg text-indigo-700 mb-2">Case post-establish</h4>
          <p class="mt-2 font-mono text-sm bg-gray-50 p-3 rounded border border-gray-200">
            establish_status = 2<br>
            temp_reference_number != null<br>
            reference_number != null
          </p>
        </div>
      </div>
    </section>

    <!-- Section 2 -->
    <section>
      <h3 class="text-lg font-bold text-gray-900 mb-3 border-b pb-1">2. Cách test submit cancel</h3>
      
      <div class="ml-4 space-y-6">
        <!-- CTCT Item -->
        <div>
          <h4 class="font-semibold text-lg text-indigo-700 mb-2">CTY CP</h4>
          <div class="space-y-4">
            <div class="bg-white border rounded-lg p-4 shadow-sm">
              <div class="font-medium text-gray-900 mb-2">Thủ tục: 設立登記の申請　※株式会社の定款認証同時申請用</div>
              <ul class="list-disc list-inside space-y-1 text-sm text-gray-600 ml-2">
                <li>(xóa AK ở table project) => status từ <span class="font-mono text-red-600">001</span> -> (<span class="font-mono text-green-600">004, 007, 002</span>) + set value agency_number</li>
                <li>=> vào giao diện thực hiện submit cancel ( <span class="font-semibold text-gray-900">設立登記申請の取下</span>)</li>
                <li>=> Check file UNIF, moj.zip xem ngày input đã là ngày user input chưa? (ký 3 lần)</li>
              </ul>
            </div>

            <div class="bg-white border rounded-lg p-4 shadow-sm">
              <div class="font-medium text-gray-900 mb-2">Thủ tục: 電磁的記録の認証の嘱託（定款認証）</div>
              <ul class="list-disc list-inside space-y-1 text-sm text-gray-600 ml-2">
                <li>(xóa AK ở table project) => status từ <span class="font-mono text-red-600">001</span> -> (<span class="font-mono text-green-600">004, 002</span>) + set value agency_number</li>
                <li>=> vào giao diện thực hiện submit cancel ( <span class="font-semibold text-gray-900">執務の中止の請求（定款認証の取下げ等）</span>)</li>
                <li>=> Check file UNIF, moj.zip xem ngày input đã là ngày user input chưa? (ký 3 lần)</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Cty TNHH Item -->
        <div>
          <h4 class="font-semibold text-lg text-indigo-700 mb-2">CTY TNHH</h4>
          <div class="bg-white border rounded-lg p-4 shadow-sm">
            <div class="font-medium text-gray-900 mb-2">Thủ tục: 設立登記の申請　※合名・合資・合同会社用及び株式会社の定款認証同時申請以外用</div>
            <ul class="list-disc list-inside space-y-1 text-sm text-gray-600 ml-2">
              <li>xóa access_key và thay đổi thủ tục status từ <span class="font-mono text-red-600">001</span> -> (<span class="font-mono text-green-600">004, 007, 002</span>) (set value cho agency_number)</li>
              <li>=> Vào màn hình thực hiện submit cancel ( <span class="font-semibold text-gray-900">設立登記申請の取下</span> )</li>
              <li>=> Check file UNIF, moj.zip xem ngày input đã là ngày user input chưa? (ký 3 lần)</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
</script>
