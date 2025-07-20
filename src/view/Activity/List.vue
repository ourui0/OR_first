<template>
  <div class="p-4">
    <div class="flex justify-between mb-4">
      <el-input v-model="keyword" placeholder="搜索活动名称" @keyup.enter="load" style="width: 200px"/>
      <el-button type="primary" @click="load">搜索</el-button>
      <el-button type="success" @click="$router.push('/activity/new')">新建活动</el-button>
    </div>

    <el-table :data="list" border>
      <el-table-column prop="title" label="活动名称"/>
      <el-table-column prop="startTime" label="开始时间" width="160"/>
      <el-table-column prop="location" label="地点" width="120"/>
      <el-table-column label="状态" width="90">
        <template #default="{row}">
          <el-tag :type="row.status==='online'?'success':'info'">
            {{ {online:'上线',offline:'下线',draft:'草稿'}[row.status] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="{row}">
          <el-button size="small" @click="$router.push(`/activity/${row.id}`)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
        class="mt-4 text-right"
        background
        layout="prev, pager, next"
        :total="total"
        v-model:current-page="page"
        @current-change="load"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getActivities } from '@/services/activity';

const keyword = ref('');
const list    = ref([]);
const total   = ref(0);
const page    = ref(1);

const load = async () => {
  const { data } = await getActivities({ keyword: keyword.value, page: page.value, size: 10 });
  list.value  = data.list;
  total.value = data.total;
};
onMounted(load);
</script>