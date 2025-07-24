<template>
  <div class="p-4">
    <el-button @click="$router.back()">返回</el-button>

    <el-card class="mt-4">
      <template #header><h2>{{ act.title }}</h2></template>
      <p><strong>时间：</strong>{{ act.startTime }} ～ {{ act.endTime }}</p>
      <p><strong>地点：</strong>{{ act.location }}</p>
      <p><strong>名额：</strong>{{ act.quota }}</p>
      <p>{{ act.desc }}</p>
      <el-button type="primary" :disabled="joined" @click="handleJoin">
        {{ joined ? '已报名' : '立即报名' }}
      </el-button>
    </el-card>

    <!-- 评论 -->
    <el-card class="mt-4">
      <template #header>活动评论</template>
      <el-input v-model="commentText" type="textarea" :rows="3" placeholder="说点什么..."/>
      <el-button class="mt-2" type="success" @click="submitComment">发表</el-button>

      <div v-for="c in comments" :key="c.id" class="mt-2 border-b pb-2">
        <strong>{{ c.username }}</strong>
        <small class="ml-2 text-gray-400">{{ c.createdAt }}</small>
        <div>{{ c.content }}</div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getActivity, joinActivity, getComments, addComment } from '@/services/activity';

const route = useRoute();
const act = ref({});
const joined = ref(false);
const comments = ref([]);
const commentText = ref('');

const loadAct = async () => {
  const { data } = await getActivity(route.params.id);
  act.value = data;
};
const loadComments = async () => {
  const { data } = await getComments(route.params.id);
  comments.value = data;
};
const handleJoin = async () => {
  await joinActivity(route.params.id);
  joined.value = true;
  alert('报名成功！');
};
const submitComment = async () => {
  if (!commentText.value.trim()) return;
  await addComment({ activityId: route.params.id, content: commentText.value });
  commentText.value = '';
  await loadComments();
};

onMounted(() => {
  loadAct();
  loadComments();
});
</script>