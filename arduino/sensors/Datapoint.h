class Datapoint {
    public:
        Datapoint(int data, int timestamp);
        int deltaTime();
        bool tolerant(int current_average);
        int data;
        int timestamp;
    };