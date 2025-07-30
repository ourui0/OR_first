<template>
  <div class="p-4">
    <div class="flex justify-between mb-4">
      <el-input v-model="keyword" placeholder="搜索活动名称" @keyup.enter="load" style="width: 200px"/>
      <el-button type="primary" @click="load">搜索</el-button>
      <el-button type="success" @click="$router.push('/activity/new')">新建活动</el-button>
      <el-button type="danger" @click="logout">退出登录</el-button>
    </div>

    <el-table :data="list" border>
      <el-table-column label="活动名称">
        <template #default="{row}">
          <div class="flex items-center">
            <span>{{ row.title }}</span>
            <!-- 修改后的已报名图标显示 -->
            <span v-if="row.enrolled" class="ml-1 text-green-500">
              <el-icon size="16" color="#67C23A"><Check /></el-icon>
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="startTime" label="开始时间" width="160"/>
      <el-table-column prop="location" label="地点" width="120"/>
      <el-table-column label="状态" width="90">
        <template #default="{row}">
          <el-tag :type="row.status==='online'?'success':'info'">
            {{ {online:'上线',offline:'下线',draft:'草稿'}[row.status] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="{row}">
          <div class="flex items-center space-x-2">
            <el-button size="small" @click="$router.push(`/activity/${row.id}`)">详情</el-button>

            <!-- 删除按钮 -->
            <el-popconfirm
                v-if="canDelete(row)"
                title="确定删除该活动吗？"
                @confirm="handleDelete(row.id)"
            >
              <template #reference>
                <el-button size="small" type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </div>
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
import {ref, onMounted, computed} from 'vue';
import {getActivities, batchCheckEnrollStatus, getToken} from '@/services/activity';
import { useRouter } from "vue-router";
import { ElMessage } from 'element-plus';
import {Check} from "@element-plus/icons-vue";
import {deleteActivity} from "@/services/api.js";


const keyword = ref('');
const list = ref([]);
const total = ref(0);
const page = ref(1);
const router = useRouter();

// 新增：加载报名状态
const loadEnrollStatuses = async () => {
  try {
    const activityIds = list.value.map(item => item.id);
    if (!activityIds.length) return;

    const res = await batchCheckEnrollStatus(activityIds);
    // console.log('原始返回对象', res.data);
    list.value.forEach(act => {
      act.enrolled = res.data.data[act.id] ?? false; // 不再转字符串
      // console.log(`活动 ${act.id} 的 enrolled =`, act.enrolled);
    });
  } catch (error) {
    console.error('加载报名状态失败:', error);
    ElMessage.error('加载报名状态失败，请稍后重试');
  }
};

const load = async () => {
  try {
    // 1. 先拿活动列表（此时数据已落盘）
    const { data } = await getActivities({
      keyword: keyword.value,
      page: page.value,
      size: 10
    });
    list.value = data.list || [];
    total.value = data.total || 0;

    // 2. 列表成功后再查报名状态
    if (list.value.length) {
      await loadEnrollStatuses();
    }
  } catch (error) {
    console.error('加载活动列表失败:', error);
    ElMessage.error('加载活动列表失败，请稍后重试');
  }
};

function logout() {
  localStorage.removeItem('token');
  router.replace('/login');
}
const currentUser = computed(() => {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
});

// 是否有删除权限
function canDelete(row) {
  if (!currentUser.value) return false;
  const { username, role } = currentUser.value;
  return role === 'admin' || row.createdBy === username;
}

// 删除
async function handleDelete(id) {
  try {
    await deleteActivity(id);   // 已经带 Authorization 头
    ElMessage.success('删除成功');
    await load();                   // 重新拉列表
  } catch (e) {
    ElMessage.error(e?.response?.data?.msg || '删除失败');
  }
}
onMounted(load);
</script>