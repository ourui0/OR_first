<template>
  <div class="p-4">
    <el-button @click="$router.back()">返回</el-button>

    <el-card class="mt-4">
      <template #header>
        <h2 class="flex items-center">
          {{ act.title }}
          <!-- 报名成功后显示绿色对勾 -->
          <el-icon v-if="joined" class="ml-2" size="20" color="#67C23A">
            <Check />
          </el-icon>
        </h2>
      </template>

      <p><strong>时间：</strong>{{ act.startTime }} ～ {{ act.endTime }}</p>
      <p><strong>地点：</strong>{{ act.location }}</p>
      <p><strong>名额：</strong>{{ act.quota }}</p>
      <p>{{ act.desc }}</p>

      <el-button
          v-if="!joined"
          type="primary"
          @click="handleJoin"
      >
        立即报名
      </el-button>

      <el-button
          v-else
          type="danger"
          @click="handleCancel"
      >
        取消报名
      </el-button>
    </el-card>

    <!-- 评论区 -->
    <el-card class="mt-4">
      <template #header>活动评论</template>

      <el-input
          v-model="commentText"
          type="textarea"
          :rows="3"
          placeholder="说点什么..."
      />
      <el-button class="mt-2" type="success" @click="submitComment">
        发表
      </el-button>

      <div
          v-for="c in comments"
          :key="c.id"
          class="mt-2 border-b pb-2"
      >
        <strong>{{ c.username }}</strong>
        <small class="ml-2 text-gray-400">{{ c.createdAt }}</small>
        <div>
          {{c.content}}
          <el-popconfirm title="确定删除这条评论？" @confirm="handleDeleteComment(c.id)">
            <template #reference>
              <el-button size="small" type="text" danger>删除</el-button>
            </template>
          </el-popconfirm>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Check } from '@element-plus/icons-vue';
import {
  getActivity,
  joinActivity,
  getComments,
  addComment,
  checkEnrollStatus, cancelJoinActivity, deleteComment
} from '@/services/activity';
import { ElMessage } from 'element-plus';

const route = useRoute();
const act = ref({});
const joined = ref(false);
const comments = ref([]);
const commentText = ref('');

const loadAct = async () => {
  try {
    const { data } = await getActivity(route.params.id);
    act.value = data;
  } catch (e) {
    ElMessage.error('加载活动失败');
  }
};

const loadEnrollStatus = async () => {
  try {
    const res = await checkEnrollStatus(route.params.id);
    joined.value = res.data.data.enrolled ?? false;
  } catch (e) {
    ElMessage.error('获取报名状态失败');
  }
};

const loadComments = async () => {
  try {
    const { data } = await getComments(route.params.id);
    comments.value = data;
  } catch (e) {
    ElMessage.error('加载评论失败');
  }
};

const handleJoin = async () => {
  try {
    await joinActivity(route.params.id);
    joined.value = true;
    ElMessage.success('报名成功');
  } catch (error) {
    if (error.response?.status === 400) {
      ElMessage.warning('您已报名过该活动');
      joined.value = true;
    } else {
      ElMessage.error('报名失败，请重试');
    }
  }
};
const handleCancel = async () => {
  try {
    await cancelJoinActivity(route.params.id);
    joined.value = false;
    ElMessage.success('已取消报名');
  } catch (e) {
    if (e.response?.status === 404) {
      ElMessage.warning('您尚未报名该活动');
    } else {
      ElMessage.error('取消失败，请重试');
    }
  }
};
const submitComment = async () => {
  if (!commentText.value.trim()) return;
  try {
    await addComment({ activityId: route.params.id, content: commentText.value });
    commentText.value = '';
    ElMessage.success('评论发表成功');

    // 给后端 200ms 落盘时间，再刷新
    await new Promise(r => setTimeout(r, 200));
    await loadComments();
  } catch (e) {
    ElMessage.error('评论发表失败');
  }
};
const handleDeleteComment = async (id) => {
  try {
    await deleteComment(id);
    ElMessage.success('已删除');

    await new Promise(r => setTimeout(r, 200));
    await loadComments();
  } catch (e) {
    ElMessage.error('删除失败');
  }
};
onMounted(async () => {
  await loadAct();
  await loadEnrollStatus();
  await loadComments();
});
</script>