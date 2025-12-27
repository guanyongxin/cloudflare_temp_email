<script setup>
import { useI18n } from 'vue-i18n'
import { useGlobalState } from '../store'
const { openSettings } = useGlobalState()


const { t } = useI18n({
    messages: {
        en: {
            copyright: "保持您的真实邮箱安全清洁。告别垃圾邮件、钓鱼攻击和不需要的邮件。使用匿名、安全、免费的一次性邮箱服务。可以手动删除邮件或等待自动删除。重要声明：此临时邮箱服务仅用于测试。"
        },
        zh: {
            copyright: "保持您的真实邮箱安全清洁。告别垃圾邮件、钓鱼攻击和不需要的邮件。使用匿名、安全、免费的一次性邮箱服务。可以手动删除邮件或等待自动删除。重要声明：此临时邮箱服务仅用于测试。"
        }
    }
});

</script>

<template>
    <div>
        <n-divider class="footer-divider" />
        <div style="text-align: center; padding: 20px">
            <n-space justify="center">
                <n-text depth="3">
                    {{ t('copyright') }}
                </n-text>               
            </n-space>
        </div>
    </div>
</template>


<style scoped>
.footer-divider {
    margin: 0;
    padding: 0 var(--x-padding);
}
</style>
