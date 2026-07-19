package com.pijieh.rtc;

import com.pijieh.rtc.database.SQLDatabase;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@SpringBootTest
class RTCAppTests {
    @MockitoBean
    SQLDatabase database;

    @Test
    void contextLoads() {
    }

}
